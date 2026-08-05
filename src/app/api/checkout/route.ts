import { NextRequest, NextResponse } from "next/server";

// Prices in haléře (CZK × 100)
const PRICES: Record<string, number> = {
  "1x":          599000,   // 5 990 Kč
  "1x-personal": 899000,   // 8 990 Kč
  "3m":         2499000,   // 24 990 Kč
  "6m":         4499000,   // 44 990 Kč
  "12m":        7499000,   // 74 990 Kč
  // Supervize
  "sup-1x":      489000,   // 4 890 Kč
  "sup-6x":     3599000,   // 35 990 Kč
  // Workshop Průvodcem v midlife
  "ws-base":    4359000,   // 43 590 Kč
  "ws-b1":      5999000,   // 59 990 Kč
  "ws-b2":      5099000,   // 50 990 Kč
  "ws-full":    6699000,   // 66 990 Kč
  // Workshop – early bird -15 % (do 31. 7. 2026)
  "ws-base-eb": 3705000,   // 37 050 Kč
  "ws-b1-eb":   5099000,   // 50 990 Kč
  "ws-b2-eb":   4334000,   // 43 340 Kč
  "ws-full-eb": 5694000,   // 56 940 Kč
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    packageId, packageTitle,
    name, email, phone,
    street, city, zip,
    company, ico,
    method = "ALL",
  } = body as {
    packageId: string; packageTitle: string;
    name: string; email: string; phone: string;
    street: string; city: string; zip: string;
    company?: string; ico?: string;
    method?: string;
  };

  // Basic validation
  if (!packageId || !name || !email || !phone || !street || !city || !zip) {
    return NextResponse.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  }

  const price = PRICES[packageId];
  if (!price) {
    return NextResponse.json({ error: "Neplatný balíček." }, { status: 400 });
  }

  const merchant = process.env.COMGATE_MERCHANT;
  const secret   = process.env.COMGATE_SECRET;

  if (!merchant || !secret) {
    return NextResponse.json(
      { error: "Platební brána není ještě nakonfigurována. Brzy bude spuštěna." },
      { status: 503 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://ivetaclarke.com";
  const refId   = `IC-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const [firstName, ...lastParts] = name.split(" ");
  const lastName = lastParts.join(" ");

  const params = new URLSearchParams({
    merchant,
    secret,
    price:        price.toString(),
    curr:         "CZK",
    label:        packageTitle,
    refId,
    method,
    email,
    phone,
    prepareOnly:  "true",
    returnUrl:    `${baseUrl}/dekujeme?ref=${refId}&status=paid`,
    notifUrl:     `${baseUrl}/api/comgate/notify`,
    // Customer billing details (used for invoice)
    firstName,
    lastName,
    street,
    city,
    postalCode:   zip,
    country:      "CZ",
    ...(company && { companyName: company }),
    ...(ico     && { companyId: ico }),
  });

  const cgRes = await fetch("https://payments.comgate.cz/v1.0/create", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    params.toString(),
  });

  const text   = await cgRes.text();
  const result = Object.fromEntries(new URLSearchParams(text));

  if (result.code !== "0") {
    console.error("ComGate error:", result);
    return NextResponse.json(
      { error: `Chyba platební brány: ${result.message || "Neznámá chyba"}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ redirect: result.redirect, transId: result.transId });
}
