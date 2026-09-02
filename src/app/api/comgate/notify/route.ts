import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

/**
 * ComGate payment notification endpoint.
 * ComGate POSTs here whenever a payment status changes (PAID, CANCELLED, etc.)
 * Must return HTTP 200 — otherwise ComGate will retry.
 */
export async function POST(req: NextRequest) {
  let data: Record<string, string> = {};

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    data = Object.fromEntries(new URLSearchParams(text));
  } else {
    // Fallback: try JSON
    try { data = await req.json(); } catch { /* ignore */ }
  }

  const { merchant, transId, secret, status, price, curr, label, refId, email } = data;

  // Verify secret matches our env variable
  if (secret !== process.env.COMGATE_SECRET) {
    console.warn("ComGate notify: invalid secret from", merchant);
    // Still return 200 to avoid ComGate retries flooding the log
    return new NextResponse("UNAUTHORIZED", { status: 200 });
  }

  console.log("ComGate notify:", { merchant, transId, status, price, curr, label, refId, email });

  const db = createServerClient();

  if (status === "PAID") {
    console.log(`✅ Payment PAID — refId=${refId}, transId=${transId}, email=${email}, ${price} ${curr}`);
    try {
      await db.from("orders")
        .update({ status: "PAID", comgate_trans_id: transId, paid_at: new Date().toISOString() })
        .eq("comgate_ref_id", refId);
    } catch (err) { console.error("DB orders update failed:", err); }

    // Check if this is a screening payment
    const { data: screening } = await db.from("screening_requests")
      .select("id, user_email, user_name, preferred_product_label")
      .eq("screening_comgate_ref", refId)
      .single();

    if (screening) {
      await db.from("screening_requests")
        .update({ status: "screening_paid", screening_paid_at: new Date().toISOString() })
        .eq("id", screening.id);

      // Notify Iveta that screening was paid
      await notifyIveta(screening.user_email, screening.user_name, screening.preferred_product_label ?? "");

      // Forward to faktura-app for invoice generation
      await forwardToFaktura(data);
    }
  }

  if (status === "CANCELLED") {
    console.log(`❌ Payment CANCELLED — refId=${refId}, transId=${transId}`);
    try {
      await db.from("orders").update({ status: "CANCELLED" }).eq("comgate_ref_id", refId);
    } catch { /* non-blocking */ }
  }

  return new NextResponse("OK", { status: 200 });
}

async function notifyIveta(userEmail: string, userName: string, product: string) {
  const resendKey = process.env.RESEND_API_KEY;
  const subject = `Screening zaplacen — ${userName}`;
  const text = `${userName} (${userEmail}) uhradil/a poplatek za screening setkání.\nPreferovaný produkt: ${product || "neuvedeno"}\n\nSpravujte žádost na: https://ivetaclarke.com/admin`;
  console.log(`📧 ${subject}`);
  if (!resendKey) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${resendKey}` },
    body: JSON.stringify({ from: "noreply@ivetaclarke.com", to: ["iveta@ivetaclarke.com"], subject, text }),
  }).catch(e => console.error("Resend error:", e));
}

async function forwardToFaktura(data: Record<string, string>) {
  const FAKTURA_URL = "https://faktura-app-iota.vercel.app";
  try {
    await fetch(`${FAKTURA_URL}/api/comgate/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString(),
    });
  } catch (e) {
    console.error("Forward to faktura-app failed:", e);
  }
}
