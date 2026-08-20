import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { email, password, firstName, lastName, phone, street, city, zip, company, ico } = await req.json();

  if (!email || !password || !firstName || !lastName || !phone || !street || !city || !zip) {
    return NextResponse.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  }

  // Create the user via anon client (sends confirmation email)
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await anonClient.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data.user) {
    return NextResponse.json({ error: "Registrace se nezdařila." }, { status: 400 });
  }

  // Insert profile via service role (bypasses RLS — works even before email confirmation)
  const db = createServerClient();
  const { error: profileError } = await db.from("profiles").insert({
    id: data.user.id,
    first_name: firstName,
    last_name: lastName,
    phone,
    street,
    city,
    zip,
    ...(company ? { company } : {}),
    ...(ico ? { ico } : {}),
  });

  if (profileError) {
    console.error("Profile insert error:", profileError);
  }

  return NextResponse.json({ userId: data.user.id, emailConfirmationRequired: !data.session });
}
