import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

const FAKTURA_URL = "https://faktura-app-iota.vercel.app";
const FAKTURA_API_KEY = process.env.FAKTURA_API_KEY || "";
const NEXTAUTH_URL = process.env.NEXT_PUBLIC_URL || "https://ivetaclarke.com";
const SCREENING_FEE = 299900; // 2 999 Kč in haléře

// Products that get the screening fee deducted
const DEDUCTIBLE_PRODUCTS = ["3m", "6m", "12m"];

const PACKAGES: Record<string, { price: number; vatRate: number; priceExVat: number; label: string }> = {
  "screening":      { price: 299900,  vatRate: 21, priceExVat: 247851,  label: "Screening – 45minutové online setkání s Ivetou Clarke" },
  "1x":             { price: 599000,  vatRate: 21, priceExVat: 495041,  label: "Jednorázová konzultace" },
  "1x-personal":    { price: 899000,  vatRate: 21, priceExVat: 742975,  label: "Konzultace osobní" },
  "3m":             { price: 2499000, vatRate: 21, priceExVat: 2065289, label: "Krátkodobá spolupráce (3 měsíce)" },
  "6m":             { price: 4499000, vatRate: 21, priceExVat: 3718182, label: "Střednědobá spolupráce (6 měsíců)" },
  "12m":            { price: 7499000, vatRate: 21, priceExVat: 6197521, label: "Roční spolupráce (12 měsíců)" },
  "sup-1x":         { price: 489000,  vatRate: 21, priceExVat: 404132,  label: "Supervize – Ochutnávka" },
  "sup-6x":         { price: 3599000, vatRate: 21, priceExVat: 2974380, label: "Supervizní balíček (6 setkání)" },
  "ws-base":        { price: 4359000, vatRate: 21, priceExVat: 3602479, label: "Workshop Průvodcem v midlife® – Základní program" },
  "ws-b1":          { price: 5999000, vatRate: 21, priceExVat: 4957851, label: "Workshop + Bonus 1 (Kultivace moudrosti)" },
  "ws-b2":          { price: 5099000, vatRate: 21, priceExVat: 4214050, label: "Workshop + Bonus 2 (Supervize)" },
  "ws-full":        { price: 6699000, vatRate: 21, priceExVat: 5536364, label: "Workshop – Plný program (oba bonusy)" },
  "ws-base-eb":     { price: 3705000, vatRate: 21, priceExVat: 3062500, label: "Workshop Základní program – Early bird" },
  "ws-b1-eb":       { price: 5099000, vatRate: 21, priceExVat: 4214050, label: "Workshop + Bonus 1 – Early bird" },
  "ws-b2-eb":       { price: 4334000, vatRate: 21, priceExVat: 3581818, label: "Workshop + Bonus 2 – Early bird" },
  "ws-full-eb":     { price: 5694000, vatRate: 21, priceExVat: 4706612, label: "Workshop Plný program – Early bird" },
};

async function verifyAdmin(req: NextRequest) {
  const jwt = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!jwt) return null;
  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${jwt}` } } }
  );
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return null;
  const db = createServerClient();
  const { data: profile } = await db.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

  const { screeningRequestId, packageId } = await req.json();
  if (!screeningRequestId || !packageId) {
    return NextResponse.json({ error: "Chybí parametry." }, { status: 400 });
  }

  const pkg = PACKAGES[packageId];
  if (!pkg) return NextResponse.json({ error: "Neplatný produkt." }, { status: 400 });

  const db = createServerClient();

  // Load screening request
  const { data: sr, error: srErr } = await db
    .from("screening_requests").select("*").eq("id", screeningRequestId).single();
  if (srErr || !sr) return NextResponse.json({ error: "Žádost nenalezena." }, { status: 404 });

  const merchant = process.env.COMGATE_MERCHANT;
  const secret = process.env.COMGATE_SECRET;
  if (!merchant || !secret) return NextResponse.json({ error: "Platební brána není nakonfigurována." }, { status: 503 });

  // Deduct screening fee for 3-month, 6-month, 12-month packages
  const deduct = DEDUCTIBLE_PRODUCTS.includes(packageId) && sr.screening_paid_at;
  const finalPrice = deduct ? pkg.price - SCREENING_FEE : pkg.price;
  const finalPriceExVat = Math.round(finalPrice / 1.21);
  const finalPriceDisplay = `${(finalPrice / 100).toLocaleString("cs-CZ")} Kč${deduct ? " (po odečtení screeningového poplatku)" : ""}`;

  const refId = `PRD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  // Create PaymentRequest in faktura-app
  if (FAKTURA_API_KEY) {
    try {
      await fetch(`${FAKTURA_URL}/api/public/payment-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": FAKTURA_API_KEY },
        body: JSON.stringify({
          productName: pkg.label + (deduct ? " (odečten screening)" : ""),
          productPrice: finalPriceExVat / 100,
          productVatRate: pkg.vatRate,
          quantity: 1,
          customerName: sr.user_name,
          customerEmail: sr.user_email,
          customerStreet: "",
          customerCity: "",
          customerZip: "",
          customerIco: "",
        }),
      });
    } catch (e) { console.error("PaymentRequest create failed:", e); }
  }

  // Create ComGate payment
  const testMode = process.env.COMGATE_TEST === "true";
  const params = new URLSearchParams({
    merchant, secret,
    price: finalPrice.toString(),
    curr: "CZK",
    label: pkg.label,
    refId,
    method: "ALL",
    email: sr.user_email,
    prepareOnly: "true",
    ...(testMode ? { test: "true" } : {}),
    returnUrl: `${NEXTAUTH_URL}/dekujeme?order=${refId}&status=paid`,
    cancelUrl: `${NEXTAUTH_URL}/dekujeme?order=${refId}&status=cancelled`,
    notifUrl: `${FAKTURA_URL}/api/comgate/webhook`,
  });

  const cgRes = await fetch("https://payments.comgate.cz/v1.0/create", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const cgText = await cgRes.text();
  const result = Object.fromEntries(new URLSearchParams(cgText));

  if (result.code !== "0") {
    return NextResponse.json({ error: `ComGate: ${result.message ?? "Neznámá chyba"}` }, { status: 500 });
  }

  const paymentLink = result.redirect;

  // Save order + update screening request
  await db.from("orders").insert({
    user_id: sr.user_id,
    package_id: packageId,
    package_title: pkg.label,
    price_czk: finalPrice,
    price_display: finalPriceDisplay,
    comgate_ref_id: refId,
    status: "PENDING",
  });

  await db.from("screening_requests").update({
    status: "payment_sent",
    selected_package_id: packageId,
    selected_package_title: pkg.label,
    selected_price_czk: finalPrice,
    product_comgate_ref: refId,
    product_payment_sent_at: new Date().toISOString(),
  }).eq("id", screeningRequestId);

  // Send email to customer
  await sendPaymentEmail(sr.user_email, sr.user_name, pkg.label, finalPriceDisplay, paymentLink);

  return NextResponse.json({ ok: true, paymentLink });
}

async function sendPaymentEmail(to: string, name: string, productName: string, priceDisplay: string, link: string) {
  const resendKey = process.env.RESEND_API_KEY;
  const subject = `Platební odkaz — ${productName}`;
  const text = `Dobrý den ${name},\n\nIveta Clarke pro vás připravila platební odkaz.\n\nForma spolupráce: ${productName}\nCena: ${priceDisplay}\n\nZaplaťte prosím zde:\n${link}\n\nPo úhradě vám bude zaslána faktura.\n\nS pozdravem,\nIveta Clarke`;
  console.log(`📧 Platební odkaz zákazníkovi ${to}: ${link}`);
  if (!resendKey) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${resendKey}` },
    body: JSON.stringify({ from: "iveta@ivetaclarke.com", to, subject, text }),
  }).catch(e => console.error("Resend error:", e));
}
