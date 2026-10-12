import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { exVat } from "@/lib/pricing";
import { sendConsultationEmail, notifyAdmins } from "@/lib/email";

const FAKTURA_URL = "https://faktura-app-iota.vercel.app";
const FAKTURA_API_KEY = process.env.FAKTURA_API_KEY || "";
const NEXTAUTH_URL = process.env.NEXT_PUBLIC_URL || "https://ivetaclarke.com";

// Screening fee: 2 999 Kč incl. 21% VAT
const SCREENING_PRICE = 299900; // haléře
const SCREENING_LABEL = "Screening – 30minutové online setkání s Ivetou Clarke";

/**
 * Pozná, že insert spadl kvůli sloupci, který v tabulce zatím není.
 * Díky tomu nová nepovinná pole nikdy neshodí registraci před spuštěním migrace.
 */
function isMissingColumn(e: { code?: string; message?: string }): boolean {
  if (e?.code === "PGRST204" || e?.code === "42703") return true;
  return /column .* does not exist|could not find the '.*' column/i.test(e?.message ?? "");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    userId, userEmail, userName, phone,
    street, city, zip, company, ico,
    method,
    screeningType,
    // paid screening fields
    whyInterested, previousExperience, goals,
    preferredProduct, preferredProductLabel,
    // workshop (free) screening fields
    workshopMotivation, workshopBackground, workshopExperience,
    preferredWorkshopVariant, preferredWorkshopVariantLabel,
    howFound,
  } = body;

  if (!userEmail || !userName) {
    return NextResponse.json({ error: "Chybí povinné údaje." }, { status: 400 });
  }

  const db = createServerClient();

  if (screeningType === "consultation") {
    const baseRow = {
      user_id: userId ?? null,
      user_email: userEmail,
      user_name: userName,
      phone: phone ?? null,
      screening_type: "consultation",
      why_interested: whyInterested ?? null,
      previous_experience: previousExperience ?? null,
      goals: goals ?? null,
      preferred_product: preferredProduct ?? null,
      preferred_product_label: preferredProductLabel ?? null,
      status: "pending",
    };
    // Uloží se jen pokud už tabulka tyto sloupce má (viz migrace v README/chatu).
    const optionalRow = {
      how_found: howFound ?? null,
      street: street ?? null,
      city: city ?? null,
      zip: zip ?? null,
    };

    let { error } = await db.from("screening_requests").insert({ ...baseRow, ...optionalRow });

    if (error && isMissingColumn(error)) {
      console.warn(
        "screening_requests postrádá sloupce how_found/street/city/zip – ukládám bez nich. " +
        "Spusťte migraci: ALTER TABLE screening_requests ADD COLUMN IF NOT EXISTS street text, " +
        "ADD COLUMN IF NOT EXISTS city text, ADD COLUMN IF NOT EXISTS zip text, " +
        "ADD COLUMN IF NOT EXISTS how_found text;"
      );
      ({ error } = await db.from("screening_requests").insert(baseRow));
    }

    if (error) {
      console.error("Consultation insert error:", error);
      return NextResponse.json({ error: "Registraci se nepodařilo uložit." }, { status: 500 });
    }

    let emailSent = false;
    let emailError: string | null = null;
    try {
      await sendConsultationEmail(userName, userEmail);
      emailSent = true;
    } catch (e) {
      emailError = e instanceof Error ? e.message : String(e);
      console.error("Consultation email error:", emailError);
    }

    await sendNotification(userEmail, userName, "consultation", preferredProductLabel ?? "", howFound);
    return NextResponse.json({ ok: true, emailSent, emailError });
  }

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

  // PaymentRequest v faktura-app se musí vytvořit JAKO PRVNÍ – jeho id je refId
  // pro ComGate a webhook faktura-app podle něj páruje platbu s fakturou.
  let paymentRequestId: string | null = null;
  if (FAKTURA_API_KEY) {
    try {
      const prRes = await fetch(`${FAKTURA_URL}/api/public/payment-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": FAKTURA_API_KEY },
        body: JSON.stringify({
          productName: SCREENING_LABEL,
          productPrice: exVat(SCREENING_PRICE) / 100,
          productVatRate: 21,
          quantity: 1,
          customerName: userName,
          customerEmail: userEmail,
          customerStreet: street ?? "",
          customerCity: city ?? "",
          customerZip: zip ?? "",
          customerIco: ico ?? "",
        }),
      });
      if (prRes.ok) {
        const prData = await prRes.json();
        paymentRequestId = prData.id ?? null;
      } else {
        console.error("PaymentRequest create failed:", prRes.status, await prRes.text());
      }
    } catch (e) {
      console.error("PaymentRequest create failed:", e);
    }
  }

  if (!paymentRequestId) {
    return NextResponse.json(
      { error: "Fakturační službu se nepodařilo oslovit, platba by zůstala bez faktury. Zkuste to prosím znovu." },
      { status: 502 },
    );
  }

  const refId = paymentRequestId;

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

  // Create ComGate payment
  const testMode = process.env.COMGATE_TEST === "true";
  const params = new URLSearchParams({
    merchant,
    secret,
    price: SCREENING_PRICE.toString(),
    curr: "CZK",
    label: SCREENING_LABEL,
    refId,
    method: method ?? "ALL",
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

const HOW_FOUND_LABELS: Record<string, string> = {
  social: "Sociální sítě",
  youtube: "YouTube / podcast",
  google: "Google nebo jiné vyhledávání",
  recommendation: "Doporučení",
  other: "Jiné",
};

async function sendNotification(
  email: string,
  name: string,
  type: "paid" | "free" | "consultation",
  product: string,
  howFound?: string,
) {
  const typeLabel =
    type === "free" ? "Registrace na výcvik (screening zdarma)"
    : type === "consultation" ? "Vstupní konzultace (30 min)"
    : "Placený screening";

  await notifyAdmins({
    heading: `Nová registrace na webu — ${name}`,
    details: {
      "Jméno": name,
      "E-mail": email,
      "Typ": typeLabel,
      "Zájem o": product || "neuvedeno",
      "Zdroj": howFound ? (HOW_FOUND_LABELS[howFound] ?? howFound) : undefined,
    },
  });
}
