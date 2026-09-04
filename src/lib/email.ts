import nodemailer from "nodemailer";
import { createServerClient } from "./supabase-server";

function tintColor(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgb(${Math.round(r + (255 - r) * amount)},${Math.round(g + (255 - g) * amount)},${Math.round(b + (255 - b) * amount)})`;
}

function buildRegistrationHtml(opts: {
  customerName: string;
  bodyTemplate: string;
  color: string;
  logoUrl?: string;
  headerText?: string;
  footerText?: string;
  bgTint?: boolean;
}): string {
  const { customerName, bodyTemplate, color, logoUrl, headerText, footerText, bgTint } = opts;
  const header = headerText || "Iveta Clarke";
  const footer = footerText || "Tato zpráva byla vygenerována automaticky.";
  const bgColor = bgTint ? tintColor(color, 0.92) : "#f5f5f5";
  const cardBg = bgTint ? tintColor(color, 0.97) : "#ffffff";
  const tableBorder = bgTint ? tintColor(color, 0.80) : "#e5e7eb";
  const footerBg = bgTint ? tintColor(color, 0.90) : "#f9fafb";

  const bodyHtml = bodyTemplate
    .replace(/\{customerName\}/g, customerName)
    .replace(/\n/g, "<br>");

  const logoSection = logoUrl
    ? `<img src="${logoUrl}" alt="${header}" style="max-height:48px;max-width:240px;object-fit:contain;">`
    : `<span style="color:#fff;font-size:20px;font-weight:700;">${header}</span>`;

  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:${bgColor};margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:${cardBg};border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:${color};padding:20px 28px;">${logoSection}</div>
    <div style="padding:28px;">
      <div style="margin:0 0 20px;color:#374151;font-size:13px;line-height:1.8;">${bodyHtml}</div>
    </div>
    <div style="background:${footerBg};border-top:1px solid ${tableBorder};padding:14px 28px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:11px;">${footer}</p>
    </div>
  </div>
</body>
</html>`;
}

const CALENDLY_URL = "https://calendly.com/iveta-clarke/individual-session";

export async function sendPaymentEmailFromDB(opts: {
  customerName: string;
  customerEmail: string;
  productName: string;
  priceDisplay: string;
  paymentLink: string;
}) {
  const { customerName, customerEmail, productName, priceDisplay, paymentLink } = opts;
  const db = createServerClient();
  const { data } = await db
    .from("email_settings")
    .select("payment_subject, payment_body, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_secure, from_name, from_email, primary_color, logo_url, header_text, footer_text, bg_tint")
    .eq("id", "default")
    .single();

  if (!data?.smtp_host || !data?.smtp_user || !data?.smtp_pass) return;

  const color = data.primary_color || "#C9A84C";
  const header = data.header_text || "Iveta Clarke";
  const footer = data.footer_text || "Tato zpráva byla vygenerována automaticky.";
  const bgTint = !!data.bg_tint;
  const bgColor = bgTint ? tintColor(color, 0.92) : "#f5f5f5";
  const cardBg = bgTint ? tintColor(color, 0.97) : "#ffffff";
  const tableBg = bgTint ? tintColor(color, 0.93) : "#f9fafb";
  const tableBorder = bgTint ? tintColor(color, 0.80) : "#e5e7eb";
  const footerBg = bgTint ? tintColor(color, 0.90) : "#f9fafb";

  const rawBody = (data.payment_body || "Dobrý den {customerName},\n\nZasíláme vám platební odkaz pro {productName}.")
    .replace(/{customerName}/g, customerName)
    .replace(/{productName}/g, productName)
    .replace(/{amount}/g, priceDisplay)
    .replace(/{link}/g, paymentLink);

  const bodyHtml = rawBody.replace(/\n/g, "<br>");

  const subject = (data.payment_subject || "Platební odkaz — {productName}")
    .replace(/{customerName}/g, customerName)
    .replace(/{productName}/g, productName);

  const logoSection = data.logo_url
    ? `<img src="${data.logo_url}" alt="${header}" style="max-height:48px;max-width:240px;object-fit:contain;">`
    : `<span style="color:#fff;font-size:20px;font-weight:700;">${header}</span>`;

  const html = `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:${bgColor};margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:${cardBg};border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:${color};padding:20px 28px;">${logoSection}</div>
    <div style="padding:28px;">
      <div style="margin:0 0 20px;color:#374151;font-size:13px;line-height:1.8;">${bodyHtml}</div>
      <div style="background:${tableBg};border:1px solid ${tableBorder};border-radius:6px;padding:16px;margin-bottom:20px;">
        <table style="width:100%;font-size:13px;color:#374151;border-collapse:collapse;">
          <tr><td style="padding:3px 0;color:#6b7280;">Forma:</td><td style="padding:3px 0;font-weight:600;text-align:right;">${productName}</td></tr>
          <tr><td style="padding:3px 0;color:#6b7280;">Celková částka:</td><td style="padding:3px 0;font-weight:700;font-size:15px;color:${color};text-align:right;">${priceDisplay}</td></tr>
        </table>
      </div>
      <div style="text-align:center;margin-bottom:16px;">
        <a href="${paymentLink}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;padding:10px 24px;border-radius:6px;font-weight:600;font-size:13px;">Zaplatit</a>
      </div>
      <div style="text-align:center;margin-bottom:20px;">
        <a href="${CALENDLY_URL}" style="display:inline-block;background:#ffffff;color:${color};text-decoration:none;padding:10px 24px;border-radius:6px;font-weight:600;font-size:13px;border:2px solid ${color};">Rezervovat Termín →</a>
      </div>
    </div>
    <div style="background:${footerBg};border-top:1px solid ${tableBorder};padding:14px 28px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:11px;">${footer}</p>
    </div>
  </div>
</body>
</html>`;

  const text = rawBody + `\n\nZaplaťte prosím zde: ${paymentLink}\n\nNebo si rezervujte termín: ${CALENDLY_URL}`;

  const transporter = nodemailer.createTransport({
    host: data.smtp_host,
    port: Number(data.smtp_port) || 587,
    secure: !!data.smtp_secure,
    auth: { user: data.smtp_user, pass: data.smtp_pass },
  });

  const from = `"${data.from_name || "Iveta Clarke"}" <${data.from_email || data.smtp_user}>`;
  await transporter.sendMail({ from, to: customerEmail, subject, text, html });
}

export async function getSmtpTransporter() {
  const db = createServerClient();
  const { data } = await db.from("email_settings").select("*").eq("id", "default").single();
  if (!data?.smtp_host || !data?.smtp_user || !data?.smtp_pass) return null;

  return {
    transporter: nodemailer.createTransport({
      host: data.smtp_host,
      port: Number(data.smtp_port) || 587,
      secure: !!data.smtp_secure,
      auth: { user: data.smtp_user, pass: data.smtp_pass },
    }),
    from: `"${data.from_name || "Iveta Clarke"}" <${data.from_email || data.smtp_user}>`,
    settings: data,
  };
}

export async function sendScreeningEmail(customerName: string, customerEmail: string) {
  const db = createServerClient();
  const { data } = await db
    .from("email_settings")
    .select("screening_subject, screening_body, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_secure, from_name, from_email, primary_color, logo_url, header_text, footer_text, bg_tint")
    .eq("id", "default")
    .single();

  if (!data?.screening_subject || !data?.screening_body) return;
  if (!data?.smtp_host || !data?.smtp_user || !data?.smtp_pass) return;

  const subject = data.screening_subject.replace(/{customerName}/g, customerName);
  const text = data.screening_body.replace(/{customerName}/g, customerName);

  const html = buildRegistrationHtml({
    customerName,
    bodyTemplate: data.screening_body,
    color: data.primary_color || "#C9A84C",
    logoUrl: data.logo_url || undefined,
    headerText: data.header_text || undefined,
    footerText: data.footer_text || undefined,
    bgTint: !!data.bg_tint,
  });

  const transporter = nodemailer.createTransport({
    host: data.smtp_host,
    port: Number(data.smtp_port) || 587,
    secure: !!data.smtp_secure,
    auth: { user: data.smtp_user, pass: data.smtp_pass },
  });

  const from = `"${data.from_name || "Iveta Clarke"}" <${data.from_email || data.smtp_user}>`;
  await transporter.sendMail({ from, to: customerEmail, subject, text, html });
}

export async function sendRegistrationEmail(customerName: string, customerEmail: string) {
  const db = createServerClient();
  const { data } = await db
    .from("email_settings")
    .select("registration_subject, registration_body, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_secure, from_name, from_email, primary_color, logo_url, header_text, footer_text, bg_tint")
    .eq("id", "default")
    .single();

  if (!data?.registration_subject || !data?.registration_body) return;
  if (!data?.smtp_host || !data?.smtp_user || !data?.smtp_pass) return;

  const subject = data.registration_subject.replace(/{customerName}/g, customerName);
  const text = data.registration_body.replace(/{customerName}/g, customerName);

  const html = buildRegistrationHtml({
    customerName,
    bodyTemplate: data.registration_body,
    color: data.primary_color || "#C9A84C",
    logoUrl: data.logo_url || undefined,
    headerText: data.header_text || undefined,
    footerText: data.footer_text || undefined,
    bgTint: !!data.bg_tint,
  });

  const transporter = nodemailer.createTransport({
    host: data.smtp_host,
    port: Number(data.smtp_port) || 587,
    secure: !!data.smtp_secure,
    auth: { user: data.smtp_user, pass: data.smtp_pass },
  });

  const from = `"${data.from_name || "Iveta Clarke"}" <${data.from_email || data.smtp_user}>`;

  await transporter.sendMail({ from, to: customerEmail, subject, text, html });
}
