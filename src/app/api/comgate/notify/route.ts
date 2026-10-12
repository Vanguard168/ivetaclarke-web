import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { notifyAdmins } from "@/lib/email";

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

    // Faktura jako první – je to to podstatné a nesmí ji shodit chyba v naší DB.
    // Platí pro každou zaplacenou platbu, ne jen pro screening.
    await forwardToFaktura(data);

    try {
      await db.from("orders")
        .update({ status: "PAID", comgate_trans_id: transId, paid_at: new Date().toISOString() })
        .eq("comgate_ref_id", refId);
    } catch (err) { console.error("DB orders update failed:", err); }

    // Platba za screening (vstupní poplatek)
    const { data: screening } = await db.from("screening_requests")
      .select("id, user_email, user_name, preferred_product_label")
      .eq("screening_comgate_ref", refId)
      .maybeSingle();

    if (screening) {
      // screening_paid_at se musí zapsat i nadále – podle něj admin počítá
      // odečet 2 999 Kč z ceny produktu.
      await db.from("screening_requests")
        .update({ status: "completed", screening_paid_at: new Date().toISOString() })
        .eq("id", screening.id);

      await notifyIveta(screening.user_email, screening.user_name, screening.preferred_product_label ?? "");
    }

    // Platba za produkt z platebního odkazu – bez tohohle by žádost zůstala
    // navždy ve stavu "Odkaz odeslán" a na "Zaplaceno" se nedalo dostat.
    const { data: product } = await db.from("screening_requests")
      .select("id, user_email, user_name, selected_package_title")
      .eq("product_comgate_ref", refId)
      .maybeSingle();

    if (product) {
      await db.from("screening_requests")
        .update({ status: "completed" })
        .eq("id", product.id);

      await notifyIveta(product.user_email, product.user_name, product.selected_package_title ?? "");
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

// Jde přes stejné SMTP jako ostatní maily – dřív to viselo na Resendu,
// který nemá nastavený klíč, takže se neodeslalo nic.
async function notifyIveta(userEmail: string, userName: string, product: string) {
  await notifyAdmins({
    heading: `Zaplaceno — ${userName}`,
    details: {
      "Jméno": userName,
      "E-mail": userEmail,
      "Produkt": product || "neuvedeno",
      "Stav": "Zaplaceno",
    },
  });
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
