import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { sendRegistrationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    firstName, lastName, email, password,
    phone, street, city, zip, company, ico,
    workshopVariantId, workshopVariantLabel,
    workshopBackground, workshopExperience, workshopMotivation,
    userToken,
  } = body;

  if (!firstName || !lastName || !email || !phone || !street || !city || !zip) {
    return NextResponse.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  }
  if (!workshopBackground || !workshopExperience || !workshopMotivation) {
    return NextResponse.json({ error: "Vyplňte prosím všechny otázky." }, { status: 400 });
  }

  const db = createServerClient();
  let userId: string;
  let userEmail: string = email;
  let newSession: { access_token: string; refresh_token: string } | null = null;

  if (userToken) {
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${userToken}` } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: "Neplatná autorizace." }, { status: 401 });
    userId = user.id;
    userEmail = user.email!;
    await db.from("profiles").update({
      first_name: firstName, last_name: lastName, phone, street, city, zip,
      ...(company ? { company } : {}), ...(ico ? { ico } : {}),
    }).eq("id", userId);
  } else {
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
    await db.from("profiles").insert({
      id: userId, first_name: firstName, last_name: lastName,
      phone, street, city, zip,
      ...(company ? { company } : {}), ...(ico ? { ico } : {}),
    });
    if (data.session) {
      newSession = { access_token: data.session.access_token, refresh_token: data.session.refresh_token };
    }
    sendRegistrationEmail(`${firstName} ${lastName}`, email).catch(e => console.error("Welcome email failed:", e));
  }

  await db.from("screening_requests").insert({
    user_id: userId,
    user_email: userEmail,
    user_name: `${firstName} ${lastName}`,
    phone,
    screening_type: "free",
    why_interested: workshopMotivation,
    previous_experience: workshopBackground,
    goals: workshopExperience,
    preferred_product: workshopVariantId ?? "workshop",
    preferred_product_label: workshopVariantLabel ?? "Výcvik Průvodcem v midlife®",
    status: "pending",
  });

  return NextResponse.json({ ok: true, session: newSession });
}
