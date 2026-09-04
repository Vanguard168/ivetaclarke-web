import nodemailer from "nodemailer";
import { createServerClient } from "./supabase-server";

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

export async function sendRegistrationEmail(customerName: string, customerEmail: string) {
  const db = createServerClient();
  const { data } = await db
    .from("email_settings")
    .select("registration_subject, registration_body, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_secure, from_name, from_email")
    .eq("id", "default")
    .single();

  if (!data?.registration_subject || !data?.registration_body) return;
  if (!data?.smtp_host || !data?.smtp_user || !data?.smtp_pass) return;

  const subject = data.registration_subject.replace(/{customerName}/g, customerName);
  const text = data.registration_body.replace(/{customerName}/g, customerName);

  const transporter = nodemailer.createTransport({
    host: data.smtp_host,
    port: Number(data.smtp_port) || 587,
    secure: !!data.smtp_secure,
    auth: { user: data.smtp_user, pass: data.smtp_pass },
  });

  const from = `"${data.from_name || "Iveta Clarke"}" <${data.from_email || data.smtp_user}>`;

  await transporter.sendMail({
    from,
    to: customerEmail,
    subject,
    text,
    html: text.replace(/\n/g, "<br>"),
  });
}
