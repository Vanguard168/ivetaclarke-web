import { NextRequest, NextResponse } from "next/server";

// Prices in haléře (CZK × 100)
const PRICES: Record<string, number> = {
  "1x":          599000,   // 5 990 Kč
  "1x-personal": 899000,   // 8 990 Kč
  "3m":         2499000,   // 24 990 Kč
  "6m":         4499000,   // 44 990 Kč
  "12m":        7499000,   // 74 990 Kč
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { packageId, packageTitle, name, email, company, ico } = body as {
    packageId: string;
    packageTitle: string;
    name: string;
    email: string;
    company?: string;
    ico?: string;
  };

  // Basic validation
  if (!packageId || !name || !email) {
    return NextResponse.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  }

  const price = PRICES[packageId];
  if (!price) {
    return NextResponse.json({ error: "Neplatný balíček." }, { status: 400 });
  }

  const merchant = process.env.COMGATE_MERCHANT;
  const secret   = process.env.COMGATE_SECRET;

  // If ComGate is not yet configured, return a friendly placeholder
  if (!merchant || !secret) {
    return NextResponse.json(
      { error: "Platební brána není ještě nakonfigurována. Brzy bude spuštěna." },
      { status: 503 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://ivetaclarke.com";
  const refId   = `IC-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  // Build ComGate payment request
  const params = new URLSearchParams({
    merchant,
    secret,
    price:       price.toString(),
    curr:        "CZK",
    label:       packageTitle,
    refId,
    method:      "ALL",
    email,
    prepareOnly: "true",
    returnUrl:   `${baseUrl}/dekujeme?ref=${refId}&status=paid`,
    notifUrl:    `${baseUrl}/api/comgate/notify`,
    // Optional customer name (appears on ComGate page)
    ...(name    && { firstName: name.split(" ")[0], lastName: name.split(" ").slice(1).join(" ") }),
    ...(company && { companyName: company }),
    ...(ico     && { companyId: ico }),
  });

  const cgRes = await fetch("https://payments.comgate.cz/v1.0/create", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    params.toString(),
  });

  const text   = await cgRes.text();
  // ComGate responds with URL-encoded string: code=0&message=OK&transId=xxx&redirect=https://...
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
