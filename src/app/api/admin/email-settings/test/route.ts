import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

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

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

  const { toEmail } = await req.json();
  if (!toEmail) return NextResponse.json({ error: "Chybí cílový e-mail." }, { status: 400 });

  const db = createServerClient();
  const { data: s } = await db.from("email_settings").select("*").eq("id", "default").single();
  if (!s?.smtp_host || !s?.smtp_user || !s?.smtp_pass) {
    return NextResponse.json({ error: "SMTP není nakonfigurováno. Uložte nejprve nastavení." }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: s.smtp_host,
      port: s.smtp_port ?? 587,
      secure: s.smtp_secure ?? false,
      auth: { user: s.smtp_user, pass: s.smtp_pass },
    });

    await transporter.sendMail({
      from: `"${s.from_name || "Iveta Clarke"}" <${s.from_email || s.smtp_user}>`,
      to: toEmail,
      subject: "Test e-mailu — Iveta Clarke",
      text: "Toto je testovací e-mail z administrace webu Iveta Clarke. SMTP nastavení funguje správně.",
      html: buildTestHtml(s),
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `SMTP chyba: ${msg}` }, { status: 500 });
  }
}

function buildTestHtml(s: Record<string, string | number | boolean | null>) {
  const color = (s.primary_color as string) || "#C9A84C";
  const header = (s.header_text as string) || "Iveta Clarke";
  const footer = (s.footer_text as string) || "Tato zpráva byla vygenerována automaticky.";

  const logo = s.logo_url
    ? `<img src="${s.logo_url}" alt="${header}" style="max-height:48px;max-width:240px;object-fit:contain;">`
    : `<span style="color:#fff;font-size:20px;font-weight:700;">${header}</span>`;

  return `
    <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:16px;">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <div style="background:${color};padding:20px 28px;">${logo}</div>
        <div style="padding:28px;">
          <p style="color:#374151;font-size:14px;line-height:1.8;">Toto je testovací e-mail z administrace webu <strong>Iveta Clarke</strong>.<br>SMTP nastavení funguje správně.</p>
        </div>
        <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:14px 28px;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:11px;">${footer}</p>
        </div>
      </div>
    </div>`;
}
