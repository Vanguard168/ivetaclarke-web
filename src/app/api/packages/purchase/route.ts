import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

const NEXTAUTH_URL = process.env.NEXT_PUBLIC_URL || "https://ivetaclarke.com";
const FAKTURA_URL = "https://faktura-app-iota.vercel.app";
const FAKTURA_API_KEY = process.env.FAKTURA_API_KEY || "";

const PACKAGES: Record<string, { price: number; vatRate: number; priceExVat: number; label: string }> = {
  "3m":     { price: 2499000, vatRate: 21, priceExVat: 2065289, label: "Krátkodobá spolupráce (3 měsíce)" },
  "6m":     { price: 4499000, vatRate: 21, priceExVat: 3718182, label: "Střednědobá spolupráce (6 měsíců)" },
  "12m":    { price: 7499000, vatRate: 21, priceExVat: 6197521, label: "Roční spolupráce (12 měsíců)" },
  "sup-1x": { price: 489000,  vatRate: 21, priceExVat: 404132,  label: "Supervize – Ochutnávka" },
  "sup-6x": { price: 3599000, vatRate: 21, priceExVat: 2974380, label: "Supervizní balíček (6 setkání)" },
  "1x":          { price: 599000,  vatRate: 21, priceExVat: 495041,  label: "Jednorázová konzultace" },
  "1x-personal": { price: 899000,  vatRate: 21, priceExVat: 742975,  label: "Konzultace osobní" },
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    packageId,
    // New user registration fields (optional — omit if logged in)
    password,
    // Billing / user data
    firstName, lastName, email, phone,
    street, city, zip, company, ico,
    // 3 questions
    whyInterested, previousExperience, goals,
    // Payment
    payMethod,
    // Existing user JWT
    userToken,
  } = body;

  if (!packageId || !firstName || !lastName || !email || !phone || !street || !city || !zip) {
    return NextResponse.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  }
  if (!whyInterested || !previousExperience || !goals) {
    return NextResponse.json({ error: "Vyplňte prosím všechny otázky." }, { status: 400 });
  }

  const pkg = PACKAGES[packageId];
  if (!pkg) return NextResponse.json({ error: "Neplatný balíček." }, { status: 400 });

  const db = createServerClient();
  let userId: string;
  let userEmail: string = email;
  let newSession: { access_token: string; refresh_token: string } | null = null;

  if (userToken) {
    // Existing logged-in user
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${userToken}` } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: "Neplatná autorizace." }, { status: 401 });
    userId = user.id;
    userEmail = user.email!;
    // Update profile with latest billing data
    await db.from("profiles").update({ first_name: firstName, last_name: lastName, phone, street, city, zip, ...(company ? { company } : {}), ...(ico ? { ico } : {}) }).eq("id", userId);
  } else {
    // New user — register
    if (!password) return NextResponse.json({ error: "Zadejte prosím heslo." }, { status: 400 });
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await anonClient.auth.signUp({ email, password });
    if (error) {
      const msg = error.message.includes("already registered")
        ? "Tento e-mail je již zaregistrován. Přihlaste se prosím."
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    if (!data.user) return NextResponse.json({ error: "Registrace se nezdařila." }, { status: 400 });
    userId = data.user.id;
    // Save profile
    await db.from("profiles").insert({
      id: userId, first_name: firstName, last_name: lastName,
      phone, street, city, zip,
      ...(company ? { company } : {}),
      ...(ico ? { ico } : {}),
    });
    // Return session so client can auto-login
    if (data.session) {
      newSession = { access_token: data.session.access_token, refresh_token: data.session.refresh_token };
    }
  }

  // Save screening request with questions
  const refId = `PKG-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  await db.from("screening_requests").insert({
    user_id: userId,
    user_email: userEmail,
    user_name: `${firstName} ${lastName}`,
    phone,
    screening_type: "paid",
    why_interested: whyInterested,
    previous_experience: previousExperience,
    goals,
    preferred_product: packageId,
    preferred_product_label: pkg.label,
    status: "pending",
    screening_comgate_ref: refId,
  });

  // Save order — screening payment, package interest saved separately in screening_requests
  await db.from("orders").insert({
    user_id: userId,
    package_id: "vstupni-konzultace",
    package_title: SCREENING_LABEL,
    price_czk: SCREENING_PRICE,
    price_display: "2 999 Kč",
    comgate_ref_id: refId,
    status: "PENDING",
  });

  // Screening (vstupní konzultace) is always 2 999 Kč — package choice is saved for context only
  const SCREENING_PRICE = 299900; // haléře = 2 999 Kč
  const SCREENING_PRICE_EX_VAT = 247851; // haléře ≈ 2 479 Kč bez DPH (2999/1.21)
  const SCREENING_LABEL = "Vstupní konzultace";

  // Create PaymentRequest in faktura-app
  if (FAKTURA_API_KEY) {
    try {
      await fetch(`${FAKTURA_URL}/api/public/payment-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": FAKTURA_API_KEY },
        body: JSON.stringify({
          productName: SCREENING_LABEL, productPrice: SCREENING_PRICE_EX_VAT / 100,
          productVatRate: 21, quantity: 1,
          customerName: `${firstName} ${lastName}`, customerEmail: userEmail,
          customerStreet: street, customerCity: city, customerZip: zip,
          customerIco: ico ?? "",
        }),
      });
    } catch (e) { console.error("PaymentRequest create failed:", e); }
  }

  // Create ComGate payment
  const merchant = process.env.COMGATE_MERCHANT;
  const secret = process.env.COMGATE_SECRET;
  if (!merchant || !secret) return NextResponse.json({ error: "Platební brána není nakonfigurována." }, { status: 503 });

  const testMode = process.env.COMGATE_TEST === "true";
  const params = new URLSearchParams({
    merchant, secret,
    price: SCREENING_PRICE.toString(),
    curr: "CZK",
    label: SCREENING_LABEL,
    refId,
    method: payMethod ?? "ALL",
    email: userEmail,
    phone,
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
    return NextResponse.json({ error: `Chyba platební brány: ${result.message ?? "Neznámá chyba"}` }, { status: 500 });
  }

  return NextResponse.json({ redirect: result.redirect, session: newSession });
}
