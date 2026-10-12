import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { exVat } from "@/lib/pricing";

// Prices in haléře (CZK × 100), VAT-inclusive
const PACKAGES: Record<string, { price: number; vatRate: number; label: string }> = {
  "1x":           { price: 599000, vatRate: 21, label: "Jednorázová konzultace" },
  "1x-personal":  { price: 899000, vatRate: 21, label: "Konzultace osobní" },
  "3m":           { price: 2499000, vatRate: 21, label: "Krátkodobá spolupráce (3 měsíce)" },
  "6m":           { price: 4499000, vatRate: 21, label: "Střednědobá spolupráce (6 měsíců)" },
  "12m":          { price: 7499000, vatRate: 21, label: "Roční spolupráce (12 měsíců)" },
  "sup-1x":       { price: 489000, vatRate: 21, label: "Supervize – Ochutnávka" },
  "sup-6x":       { price: 3599000, vatRate: 21, label: "Supervizní balíček (6 setkání)" },
  "ws-base":      { price: 2399900, vatRate: 21, label: "Masterclass Průvodcem v midlife® – Základní program" },
  "ws-b2":        { price: 2799900, vatRate: 21, label: "Masterclass Průvodcem v midlife® – Základní program se supervizí" },
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
          productPrice: exVat(pkg.price, pkg.vatRate) / 100,
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

  // 2. Call ComGate directly with our credentials.
  // refId musí být id PaymentRequestu — podle něj faktura-app páruje platbu
  // s fakturou. Bez něj by platba proběhla bez faktury, proto radši neproběhne.
  if (!paymentRequestId) {
    return NextResponse.json(
      { error: "Fakturační službu se nepodařilo oslovit, platba by zůstala bez faktury. Zkuste to prosím znovu." },
      { status: 502 },
    );
  }
  const refId = paymentRequestId;

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
    notifUrl: `${NEXTAUTH_URL}/api/comgate/notify`,
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
