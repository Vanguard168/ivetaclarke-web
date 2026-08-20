import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { orderId, userId } = await req.json();

  if (!orderId || !userId) {
    return NextResponse.json({ error: "Chybí parametry." }, { status: 400 });
  }

  const db = createServerClient();

  // Fetch the order and verify ownership
  const { data: order, error } = await db
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Objednávka nenalezena." }, { status: 404 });
  }

  if (order.status !== "PAID") {
    return NextResponse.json({ error: "Storno lze podat pouze u zaplacených objednávek." }, { status: 400 });
  }

  const paidAt = new Date(order.paid_at);
  const daysSincePaid = (Date.now() - paidAt.getTime()) / 86400000;
  if (daysSincePaid > 14) {
    return NextResponse.json({ error: "Lhůta 14 dní pro storno uplynula." }, { status: 400 });
  }

  // Mark as cancel requested
  await db.from("orders").update({ status: "CANCEL_REQUESTED" }).eq("id", orderId);

  // Send notification emails
  const emailBody = `
Žádost o storno objednávky

Objednávka: ${order.package_title}
Cena: ${order.price_display}
ComGate transId: ${order.comgate_trans_id ?? "—"}
ComGate refId: ${order.comgate_ref_id}
Datum platby: ${order.paid_at ? new Date(order.paid_at).toLocaleDateString("cs-CZ") : "—"}
User ID: ${order.user_id}

Zákazník požádal o storno. Prosím zpracujte vrácení platby přes ComGate portál.
  `.trim();

  await Promise.allSettled([
    sendEmail("iveta@ivetaclarke.com", `Žádost o storno — ${order.package_title}`, emailBody),
    sendEmail("v@babec.eu", `Žádost o storno — ${order.package_title}`, emailBody),
  ]);

  return NextResponse.json({ ok: true });
}

async function sendEmail(to: string, subject: string, text: string) {
  // Uses the existing FAKTURA_API_KEY / any SMTP you have, or a simple fetch to a mail service.
  // For now, log to console — replace with your email provider when ready.
  console.log(`📧 Email to ${to}: ${subject}\n${text}`);

  // Example using Resend (if RESEND_API_KEY is set):
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${resendKey}` },
    body: JSON.stringify({
      from: "noreply@ivetaclarke.com",
      to,
      subject,
      text,
    }),
  });
}
