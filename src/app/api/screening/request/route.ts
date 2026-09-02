import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

const FAKTURA_URL = "https://faktura-app-iota.vercel.app";
const FAKTURA_API_KEY = process.env.FAKTURA_API_KEY || "";
const NEXTAUTH_URL = process.env.NEXT_PUBLIC_URL || "https://ivetaclarke.com";

// Screening fee: 2 999 Kč incl. 21% VAT
const SCREENING_PRICE = 299900; // haléře
const SCREENING_PRICE_EX_VAT = 247851; // haléře
const SCREENING_LABEL = "Screening – 45minutové online setkání s Ivetou Clarke";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    userId, userEmail, userName, phone,
    screeningType,
    // paid screening fields
    whyInterested, previousExperience, goals,
    preferredProduct, preferredProductLabel,
    // workshop (free) screening fields
    workshopMotivation, workshopBackground, workshopExperience,
    preferredWorkshopVariant, preferredWorkshopVariantLabel,
  } = body;

  if (!userId || !userEmail || !userName) {
    return NextResponse.json({ error: "Chybí povinné údaje." }, { status: 400 });
  }

  const db = createServerClient();

  if (screeningType === "free") {
    // Workshop screening — no payment, just save and notify Iveta
    const { error } = await db.from("screening_requests").insert({
      user_id: userId,
      user_email: userEmail,
      user_name: userName,
      phone: phone ?? null,
      screening_type: "free",
      workshop_motivation: workshopMotivation ?? null,
      workshop_background: workshopBackground ?? null,
      workshop_experience: workshopExperience ?? null,
      preferred_workshop_variant: preferredWorkshopVariant ?? null,
      preferred_workshop_variant_label: preferredWorkshopVariantLabel ?? null,
      status: "pending",
    });

    if (error) {
      console.error("Screening insert error:", error);
      return NextResponse.json({ error: "Registraci se nepodařilo uložit." }, { status: 500 });
    }

    // Notify Iveta
    await sendNotification(userEmail, userName, "free", preferredWorkshopVariantLabel ?? "");

    return NextResponse.json({ ok: true });
  }

  // Paid screening — create payment
  const merchant = process.env.COMGATE_MERCHANT;
  const secret = process.env.COMGATE_SECRET;

  if (!merchant || !secret) {
    return NextResponse.json({ error: "Platební brána není nakonfigurována." }, { status: 503 });
  }

  // Save screening request first
  const refId = `SCR-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const { error: insertError } = await db.from("screening_requests").insert({
    user_id: userId,
    user_email: userEmail,
    user_name: userName,
    phone: phone ?? null,
    screening_type: "paid",
    why_interested: whyInterested ?? null,
    previous_experience: previousExperience ?? null,
    goals: goals ?? null,
    preferred_product: preferredProduct ?? null,
    preferred_product_label: preferredProductLabel ?? null,
    status: "pending",
    screening_comgate_ref: refId,
  });

  if (insertError) {
    console.error("Screening insert error:", insertError);
    return NextResponse.json({ error: "Registraci se nepodařilo uložit." }, { status: 500 });
  }

  // Also save to orders table (shows in /muj-ucet)
  await db.from("orders").insert({
    user_id: userId,
    package_id: "screening",
    package_title: SCREENING_LABEL,
    price_czk: SCREENING_PRICE,
    price_display: "2 999 Kč",
    comgate_ref_id: refId,
    status: "PENDING",
  }).then(({ error }) => { if (error) console.error("Order insert error:", error); });

  // Create PaymentRequest in faktura-app
  if (FAKTURA_API_KEY) {
    try {
      await fetch(`${FAKTURA_URL}/api/public/payment-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": FAKTURA_API_KEY },
        body: JSON.stringify({
          productName: SCREENING_LABEL,
          productPrice: SCREENING_PRICE_EX_VAT / 100,
          productVatRate: 21,
          quantity: 1,
          customerName: userName,
          customerEmail: userEmail,
          customerStreet: "",
          customerCity: "",
          customerZip: "",
          customerIco: "",
        }),
      });
    } catch (e) {
      console.error("PaymentRequest create failed:", e);
    }
  }

  // Create ComGate payment
  const testMode = process.env.COMGATE_TEST === "true";
  const params = new URLSearchParams({
    merchant,
    secret,
    price: SCREENING_PRICE.toString(),
    curr: "CZK",
    label: SCREENING_LABEL,
    refId,
    method: "ALL",
    email: userEmail,
    phone: phone ?? "",
    prepareOnly: "true",
    ...(testMode ? { test: "true" } : {}),
    returnUrl: `${NEXTAUTH_URL}/dekujeme?order=${refId}&status=paid`,
    cancelUrl: `${NEXTAUTH_URL}/dekujeme?order=${refId}&status=cancelled`,
    notifUrl: `${NEXTAUTH_URL}/api/comgate/notify`,
  });

  const cgRes = await fetch("https://payments.comgate.cz/v1.0/create", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const cgText = await cgRes.text();
  const result = Object.fromEntries(new URLSearchParams(cgText));

  if (result.code !== "0") {
    console.error("ComGate error:", result);
    return NextResponse.json({ error: `Chyba platební brány: ${result.message ?? "Neznámá chyba"}` }, { status: 500 });
  }

  return NextResponse.json({ redirect: result.redirect });
}

async function sendNotification(email: string, name: string, type: "paid" | "free", product: string) {
  const resendKey = process.env.RESEND_API_KEY;
  const subject = type === "free"
    ? `Nová registrace na výcvik — ${name}`
    : `Nová žádost o screening — ${name}`;
  const text = type === "free"
    ? `${name} (${email}) se zaregistroval/a na bezplatný screening pro výcvik.\nPreferovaná varianta: ${product || "neuvedena"}\n\nSpravujte žádost na: https://ivetaclarke.com/admin`
    : `${name} (${email}) uhradil/a screening a čeká na kontakt.\nPreferovaný produkt: ${product || "neuvedeno"}\n\nSpravujte žádost na: https://ivetaclarke.com/admin`;

  console.log(`📧 Notifikace Ivetě: ${subject}`);

  if (!resendKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${resendKey}` },
    body: JSON.stringify({
      from: "noreply@ivetaclarke.com",
      to: ["iveta@ivetaclarke.com"],
      subject,
      text,
    }),
  }).catch(e => console.error("Resend error:", e));
}
