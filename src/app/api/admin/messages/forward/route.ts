import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

async function verifyAdmin(req: NextRequest) {
  const jwt = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!jwt) return null;
  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${jwt}` } } }
  );
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return null;
  const db = createServerClient();
  const { data: profile } = await db.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });

  const db = createServerClient();
  const { data: msg } = await db.from("contact_messages").select("*").eq("id", id).single();
  if (!msg) return NextResponse.json({ error: "Zpráva nenalezena." }, { status: 404 });

  const { data: settings } = await db
    .from("email_settings")
    .select("smtp_host, smtp_port, smtp_user, smtp_pass, smtp_secure, from_name, from_email")
    .eq("id", "default")
    .single();

  if (!settings?.smtp_host || !settings?.smtp_user || !settings?.smtp_pass) {
    return NextResponse.json({ error: "SMTP není nakonfigurováno." }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: settings.smtp_host,
    port: Number(settings.smtp_port) || 587,
    secure: !!settings.smtp_secure,
    auth: { user: settings.smtp_user, pass: settings.smtp_pass },
  });

  const date = new Date(msg.created_at).toLocaleString("cs-CZ", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  await transporter.sendMail({
    from: `"${settings.from_name || "Iveta Clarke"}" <${settings.from_email || settings.smtp_user}>`,
    to: "iveta@ivetaclarke.com",
    subject: `Zpráva z webu — ${msg.name}`,
    text: `Dobrý den,\n\npřišla nová zpráva z kontaktního formuláře na ivetaclarke.com.\n\nOd: ${msg.name} (${msg.email})\nOdesláno: ${date}\n\nZpráva:\n${msg.message}`,
    html: `<p>Dobrý den,</p><p>přišla nová zpráva z kontaktního formuláře na ivetaclarke.com.</p><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px"><tr><td style="color:#6b7280;padding:3px 12px 3px 0">Od:</td><td><strong>${msg.name}</strong> (${msg.email})</td></tr><tr><td style="color:#6b7280;padding:3px 12px 3px 0">Odesláno:</td><td>${date}</td></tr></table><p style="margin-top:16px;color:#6b7280">Zpráva:</p><div style="background:#f9fafb;border-left:3px solid #C9A84C;padding:12px 16px;font-size:14px;line-height:1.7">${msg.message.replace(/\n/g, "<br>")}</div>`,
  });

  // Mark as read
  await db.from("contact_messages").update({ read: true }).eq("id", id);

  return NextResponse.json({ ok: true });
}
