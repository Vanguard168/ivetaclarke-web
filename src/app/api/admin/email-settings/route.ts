import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

async function verifyAdmin(req: NextRequest) {
  try {
    const jwt = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!jwt) return null;
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    );
    const { data } = await userClient.auth.getUser();
    if (!data?.user) return null;
    const db = createServerClient();
    const { data: profile } = await db.from("profiles").select("role").eq("id", data.user.id).single();
    return profile?.role === "admin" ? data.user : null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

  const db = createServerClient();
  const { data, error } = await db.from("email_settings").select("*").eq("id", "default").single();
  if (error && error.code !== "PGRST116") return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? {});
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

  const body = await req.json();
  const db = createServerClient();
  const { error } = await db.from("email_settings").upsert({
    id: "default",
    from_name: body.fromName ?? "",
    from_email: body.fromEmail ?? "",
    smtp_host: body.smtpHost ?? "",
    smtp_port: body.smtpPort ?? 587,
    smtp_user: body.smtpUser ?? "",
    smtp_pass: body.smtpPass ?? "",
    smtp_secure: body.smtpSecure ?? false,
    screening_subject: body.screeningSubject ?? "",
    screening_body: body.screeningBody ?? "",
    payment_subject: body.paymentSubject ?? "",
    payment_body: body.paymentBody ?? "",
    auto_send: body.autoSend ?? false,
    primary_color: body.primaryColor ?? "#C9A84C",
    logo_url: body.logoUrl ?? "",
    header_text: body.headerText ?? "",
    footer_text: body.footerText ?? "",
    bg_tint: body.bgTint ?? false,
    updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
