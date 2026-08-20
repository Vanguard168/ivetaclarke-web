import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

// Prices in haléře (CZK × 100), VAT-inclusive
const PACKAGES: Record<string, { price: number; vatRate: number; priceExVat: number; label: string }> = {
  "1x":           { price: 599000, vatRate: 21, priceExVat: 495041,  label: "Jednorázová konzultace" },
  "1x-personal":  { price: 899000, vatRate: 21, priceExVat: 742975,  label: "Konzultace osobní" },
  "3m":           { price: 2499000, vatRate: 21, priceExVat: 2065289, label: "Krátkodobá spolupráce (3 měsíce)" },
  "6m":           { price: 4499000, vatRate: 21, priceExVat: 3718182, label: "Střednědobá spolupráce (6 měsíců)" },
  "12m":          { price: 7499000, vatRate: 21, priceExVat: 6197521, label: "Roční spolupráce (12 měsíců)" },
  "sup-1x":       { price: 489000, vatRate: 21, priceExVat: 404132,  label: "Supervize – Ochutnávka" },
  "sup-6x":       { price: 3599000, vatRate: 21, priceExVat: 2974380, label: "Supervizní balíček (6 setkání)" },
  "ws-base":      { price: 4359000, vatRate: 21, priceExVat: 3602479, label: "Workshop Průvodcem v midlife® – Základní program" },
  "ws-b1":        { price: 5999000, vatRate: 21, priceExVat: 4957851, label: "Workshop + Bonus 1 (Kultivace moudrosti)" },
  "ws-b2":        { price: 5099000, vatRate: 21, priceExVat: 4214050, label: "Workshop + Bonus 2 (Supervize)" },
  "ws-full":      { price: 6699000, vatRate: 21, priceExVat: 5536364, label: "Workshop – Plný program (oba bonusy)" },
  "ws-base-eb":   { price: 3705000, vatRate: 21, priceExVat: 3062500, label: "Workshop Základní program – Early bird" },
  "ws-b1-eb":     { price: 5099000, vatRate: 21, priceExVat: 4214050, label: "Workshop + Bonus 1 – Early bird" },
  "ws-b2-eb":     { price: 4334000, vatRate: 21, priceExVat: 3581818, label: "Workshop + Bonus 2 – Early bird" },
  "ws-full-eb":   { price: 5694000, vatRate: 21, priceExVat: 4706612, label: "Workshop Plný program – Early bird" },
};

const FAKTURA_URL = "https://faktura-app-iota.vercel.app";
const FAKTURA_API_KEY = process.env.FAKTURA_API_KEY || "";
const NEXTAUTH_URL = process.env.NEXT_PUBLIC_URL || "https://ivetaclarke.com";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    packageId, packageTitle,
    name, email, phone,
    street, city, zip,
    company, ico,
    method = "ALL",
    userId,
    priceDisplay,
  } = body as {
    packageId: string; packageTitle: string;
    name: string; email: string; phone: string;
    street: string; city: string; zip: string;
    company?: string; ico?: string;
    method?: string;
    userId?: string;
    priceDisplay?: string;
  };

  if (!packageId || !name || !email || !phone || !street || !city || !zip) {
    return NextResponse.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  }

  const pkg = PACKAGES[packageId];
  if (!pkg) {
    return NextResponse.json({ error: "Neplatný balíček." }, { status: 400 });
  }

  const merchant = process.env.COMGATE_MERCHANT;
  const secret = process.env.COMGATE_SECRET;

  if (!merchant || !secret) {
    return NextResponse.json(
      { error: "Platební brána není ještě nakonfigurována. Brzy bude spuštěna." },
      { status: 503 }
    );
  }

  // 1. Create PaymentRequest in faktura-app (for invoice generation after payment)
  let paymentRequestId: string | null = null;
  if (FAKTURA_API_KEY) {
    try {
      const prRes = await fetch(`${FAKTURA_URL}/api/public/payment-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": FAKTURA_API_KEY },
        body: JSON.stringify({
          productName: pkg.label,
          productPrice: pkg.priceExVat / 100,
          productVatRate: pkg.vatRate,
          quantity: 1,
          customerName: name,
          customerEmail: email,
          customerStreet: street,
          customerCity: city,
          customerZip: zip,
          customerIco: ico || "",
        }),
      });
      if (prRes.ok) {
        const prData = await prRes.json();
        paymentRequestId = prData.id;
      }
    } catch (e) {
      console.error("PaymentRequest create failed:", e);
    }
  }

  // 2. Call ComGate directly with our credentials
  const refId = paymentRequestId || `IC-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const testMode = process.env.COMGATE_TEST === "true";

  const params = new URLSearchParams({
    merchant,
    secret,
    price: pkg.price.toString(),
    curr: "CZK",
    label: pkg.label,
    refId,
    method,
    email,
    phone,
    prepareOnly: "true",
    ...(testMode ? { test: "true" } : {}),
    returnUrl: `${NEXTAUTH_URL}/dekujeme?order=${refId}&status=paid`,
    cancelUrl: `${NEXTAUTH_URL}/dekujeme?order=${refId}&status=cancelled`,
    notifUrl: `${FAKTURA_URL}/api/comgate/webhook`,
  });

  // Save pending order to Supabase
  if (userId) {
    try {
      const db = createServerClient();
      await db.from("orders").insert({
        user_id: userId,
        package_id: packageId,
        package_title: packageTitle,
        price_czk: pkg.price,
        price_display: priceDisplay ?? `${(pkg.price / 100).toLocaleString("cs-CZ")} Kč`,
        comgate_ref_id: refId,
        status: "PENDING",
      });
    } catch { /* non-blocking */ }
  }

  const cgRes = await fetch("https://payments.comgate.cz/v1.0/create", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const text = await cgRes.text();
  const result = Object.fromEntries(new URLSearchParams(text));

  if (result.code !== "0") {
    console.error("ComGate error:", result);
    return NextResponse.json(
      { error: `ComGate chyba: ${result.message || "Neznámá chyba"}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ redirect: result.redirect, transId: result.transId });
}
