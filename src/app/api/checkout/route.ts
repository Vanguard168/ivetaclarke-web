import { NextRequest, NextResponse } from "next/server";

// Maps custom web packageId → faktura-app product ID
// Update these IDs after adding supervize + workshop products in /produkty
const PRODUCT_MAP: Record<string, string> = {
  "1x":           "cmszy76x20003pg0u9a14tv94",  // Jednorázová konzultace
  "1x-personal":  "cmszya2190005pg0ux7qksar3",  // Konzultace osobní
  "3m":           "cmszyayu00007pg0u498h0uwv",  // Krátkodobá spolupráce 3m
  "6m":           "cmszybocd0009pg0uod5j2yly",  // Střednědobá spolupráce 6m
  "12m":          "cmszyd04a000bpg0uprkxeako",  // Roční spolupráce 12m
  // Supervize — doplň ID po přidání v /produkty
  // "sup-1x":    "...",
  // "sup-6x":    "...",
  // Workshop — doplň ID po přidání v /produkty
  // "ws-base":   "...",
  // "ws-b1":     "...",
  // "ws-b2":     "...",
  // "ws-full":   "...",
  // "ws-base-eb":"...",
  // "ws-b1-eb":  "...",
  // "ws-b2-eb":  "...",
  // "ws-full-eb":"...",
};

const FAKTURA_URL = "https://faktura-app-iota.vercel.app";
const FAKTURA_API_KEY = process.env.FAKTURA_API_KEY || "";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    packageId, packageTitle,
    name, email, phone,
    street, city, zip,
    company, ico,
  } = body as {
    packageId: string; packageTitle: string;
    name: string; email: string; phone: string;
    street: string; city: string; zip: string;
    company?: string; ico?: string;
    method?: string;
  };

  if (!packageId || !name || !email || !phone || !street || !city || !zip) {
    return NextResponse.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  }

  const productId = PRODUCT_MAP[packageId];
  if (!productId) {
    return NextResponse.json({ error: "Tento produkt zatím není dostupný k online platbě." }, { status: 400 });
  }

  if (!FAKTURA_API_KEY) {
    return NextResponse.json(
      { error: "Platební brána není ještě nakonfigurována." },
      { status: 503 }
    );
  }

  const res = await fetch(`${FAKTURA_URL}/api/public/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": FAKTURA_API_KEY,
    },
    body: JSON.stringify({
      productId,
      customerName: name,
      customerEmail: email,
      customerStreet: street,
      customerCity: city,
      customerZip: zip,
      customerIco: ico || "",
      customerDic: company ? "" : "",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Faktura checkout error:", data);
    return NextResponse.json(
      { error: data.error || "Chyba platební brány." },
      { status: 500 }
    );
  }

  // data.paymentUrl = ComGate redirect URL
  return NextResponse.json({ redirect: data.paymentUrl, transId: data.orderId });
}
