import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Vyplňte prosím všechna pole." }, { status: 400 });
  }

  const db = createServerClient();

  // Save to DB
  const { error } = await db.from("contact_messages").insert({ name, email, message });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send notification email via SMTP
  const { data: settings } = await db
    .from("email_settings")
    .select("smtp_host, smtp_port, smtp_user, smtp_pass, smtp_secure, from_name, from_email")
    .eq("id", "default")
    .single();

  if (settings?.smtp_host && settings?.smtp_user && settings?.smtp_pass) {
    try {
      const transporter = nodemailer.createTransport({
        host: settings.smtp_host,
        port: Number(settings.smtp_port) || 587,
        secure: !!settings.smtp_secure,
        auth: { user: settings.smtp_user, pass: settings.smtp_pass },
      });

      const now = new Date().toLocaleString("cs-CZ", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });

      await transporter.sendMail({
        from: `"${settings.from_name || "Iveta Clarke"}" <${settings.from_email || settings.smtp_user}>`,
        to: "iveta@ivetaclarke.com",
        subject: `Zpráva z webu — ${name}`,
        text: `Dobrý den,\n\npřišla nová zpráva z kontaktního formuláře na ivetaclarke.com.\n\nOd: ${name} (${email})\nOdesláno: ${now}\n\nZpráva:\n${message}`,
        html: `<p>Dobrý den,</p><p>přišla nová zpráva z kontaktního formuláře na ivetaclarke.com.</p><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px"><tr><td style="color:#6b7280;padding:3px 12px 3px 0">Od:</td><td><strong>${name}</strong> (${email})</td></tr><tr><td style="color:#6b7280;padding:3px 12px 3px 0">Odesláno:</td><td>${now}</td></tr></table><p style="margin-top:16px;color:#6b7280">Zpráva:</p><div style="background:#f9fafb;border-left:3px solid #C9A84C;padding:12px 16px;font-size:14px;line-height:1.7">${message.replace(/\n/g, "<br>")}</div>`,
      });
    } catch (e) {
      console.error("Contact notification email failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
