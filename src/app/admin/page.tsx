"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const C = {
  cream: "#FAF8F4", warm: "#F0EBE3", sand: "#E8DDD0",
  gold: "#C9A84C", goldLight: "#E8C96A", dark: "#2C2C3E",
  darker: "#1E1E2E", text: "#3A3530", muted: "#8A8070", white: "#FFFFFF",
  green: "#4CAF7C", red: "#C85050",
};

const PRODUCTS = [
  { id: "1x",         label: "Jednorázová konzultace",            price: "5 990 Kč" },
  { id: "1x-personal",label: "Konzultace osobní",                 price: "8 990 Kč" },
  { id: "3m",         label: "Krátkodobá spolupráce (3 měsíce)",  price: "24 990 Kč (−2 999 Kč po odečtení screeningu)" },
  { id: "6m",         label: "Střednědobá spolupráce (6 měsíců)", price: "44 990 Kč (−2 999 Kč po odečtení screeningu)" },
  { id: "12m",        label: "Roční spolupráce (12 měsíců)",      price: "74 990 Kč (−2 999 Kč po odečtení screeningu)" },
  { id: "sup-1x",     label: "Supervize – Ochutnávka",            price: "4 890 Kč" },
  { id: "sup-6x",     label: "Supervizní balíček (6 setkání)",    price: "35 990 Kč" },
  { id: "ws-base",    label: "Workshop – Základní program",       price: "43 590 Kč" },
  { id: "ws-b1",      label: "Workshop + Bonus 1",                price: "59 990 Kč" },
  { id: "ws-b2",      label: "Workshop + Bonus 2",                price: "50 990 Kč" },
  { id: "ws-full",    label: "Workshop – Plný program",           price: "66 990 Kč" },
  { id: "ws-base-eb", label: "Workshop Základní – Early bird",    price: "37 050 Kč" },
  { id: "ws-b1-eb",   label: "Workshop + Bonus 1 – Early bird",   price: "50 990 Kč" },
  { id: "ws-b2-eb",   label: "Workshop + Bonus 2 – Early bird",   price: "43 340 Kč" },
  { id: "ws-full-eb", label: "Workshop Plný – Early bird",        price: "56 940 Kč" },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:        { label: "Čeká na platbu screeningu", color: C.muted },
  screening_paid: { label: "Screening zaplacen",        color: C.green },
  screening_done: { label: "Screening proběhl",         color: C.green },
  payment_sent:   { label: "Odkaz odeslán",             color: C.gold },
  completed:      { label: "Dokončeno",                 color: C.green },
  cancelled:      { label: "Zrušeno",                  color: C.red },
};

type ScreeningRequest = {
  id: string; user_id: string; user_email: string; user_name: string; phone?: string;
  screening_type: "paid" | "free";
  why_interested?: string; previous_experience?: string; goals?: string;
  preferred_product?: string; preferred_product_label?: string;
  workshop_motivation?: string; workshop_background?: string; workshop_experience?: string;
  preferred_workshop_variant?: string; preferred_workshop_variant_label?: string;
  status: string; screening_paid_at?: string;
  selected_package_id?: string; selected_package_title?: string;
  admin_notes?: string; product_payment_sent_at?: string; created_at: string;
};

type EmailSettings = {
  fromName: string; fromEmail: string;
  smtpHost: string; smtpPort: number; smtpUser: string; smtpPass: string; smtpSecure: boolean;
  screeningSubject: string; screeningBody: string;
  paymentSubject: string; paymentBody: string;
  autoSend: boolean;
  primaryColor: string; logoUrl: string; headerText: string; footerText: string; bgTint: boolean;
};

const EMAIL_DEFAULTS: EmailSettings = {
  fromName: "Iveta Clarke", fromEmail: "",
  smtpHost: "", smtpPort: 587, smtpUser: "", smtpPass: "", smtpSecure: false,
  screeningSubject: "Potvrzení screeningového setkání",
  screeningBody: `Dobrý den, {customerName},

děkujeme za uhrazení screeningového poplatku. Iveta vás brzy kontaktuje s termínem setkání.

S pozdravem,
Iveta Clarke`,
  paymentSubject: "Platební odkaz — {productName}",
  paymentBody: `Dobrý den, {customerName},

Iveta Clarke pro vás připravila platební odkaz:

Forma: {productName}
Cena: {amount}

Zaplaťte prosím zde:
{link}

Po úhradě vám bude zaslána faktura.

S pozdravem,
Iveta Clarke`,
  autoSend: false,
  primaryColor: "#C9A84C", logoUrl: "", headerText: "Iveta Clarke",
  footerText: "Tato zpráva byla vygenerována automaticky.", bgTint: false,
};

function tintColor(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgb(${Math.round(r + (255 - r) * amount)},${Math.round(g + (255 - g) * amount)},${Math.round(b + (255 - b) * amount)})`;
}

// ─── Email Preview ───────────────────────────────────────────────────────────
function EmailPreview({ s }: { s: EmailSettings }) {
  const color = s.primaryColor || "#C9A84C";
  const footer = s.footerText || "Tato zpráva byla vygenerována automaticky.";
  const headerLabel = s.headerText || "Iveta Clarke";
  const bgColor = s.bgTint ? tintColor(color, 0.92) : "#f5f5f5";
  const cardBg = s.bgTint ? tintColor(color, 0.97) : "#ffffff";
  const tableBg = s.bgTint ? tintColor(color, 0.93) : "#f9fafb";
  const tableBorder = s.bgTint ? tintColor(color, 0.80) : "#e5e7eb";
  const footerBg = s.bgTint ? tintColor(color, 0.90) : "#f9fafb";

  const bodyHtml = s.paymentBody
    .replace(/\{customerName\}/g, "Jana Nováková")
    .replace(/\{productName\}/g, "Krátkodobá spolupráce (3 měsíce)")
    .replace(/\{amount\}/g, "22 990 Kč")
    .replace(/\{link\}/g, "#")
    .replace(/\n/g, "<br>");

  const logoSection = s.logoUrl
    ? `<img src="${s.logoUrl}" alt="${headerLabel}" style="max-height:48px;max-width:240px;object-fit:contain;">`
    : `<span style="color:#fff;font-size:20px;font-weight:700;">${headerLabel}</span>`;

  const html = `
    <div style="font-family:Arial,sans-serif;background:${bgColor};padding:16px;">
      <div style="max-width:560px;margin:0 auto;background:${cardBg};border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <div style="background:${color};padding:20px 28px;">${logoSection}</div>
        <div style="padding:28px;">
          <div style="margin:0 0 20px;color:#374151;font-size:13px;line-height:1.8;">${bodyHtml}</div>
          <div style="background:${tableBg};border:1px solid ${tableBorder};border-radius:6px;padding:16px;margin-bottom:20px;">
            <table style="width:100%;font-size:13px;color:#374151;border-collapse:collapse;">
              <tr><td style="padding:3px 0;color:#6b7280;">Forma:</td><td style="padding:3px 0;font-weight:600;text-align:right;">Krátkodobá spolupráce</td></tr>
              <tr><td style="padding:3px 0;color:#6b7280;">Celková částka:</td><td style="padding:3px 0;font-weight:700;font-size:15px;color:${color};text-align:right;">22 990 Kč</td></tr>
            </table>
          </div>
          <div style="text-align:center;margin-bottom:20px;">
            <a href="#" style="display:inline-block;background:${color};color:#fff;text-decoration:none;padding:10px 24px;border-radius:6px;font-weight:600;font-size:13px;">Zaplatit</a>
          </div>
        </div>
        <div style="background:${footerBg};border-top:1px solid ${tableBorder};padding:14px 28px;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:11px;">${footer}</p>
        </div>
      </div>
    </div>`;

  return (
    <div style={{ border: `1px solid ${C.sand}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "8px 14px", borderBottom: `1px solid ${C.sand}`, background: C.warm, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#f87171", "#fbbf24", "#4ade80"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <span style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>Náhled e-mailu (platební odkaz)</span>
      </div>
      <iframe srcDoc={html} style={{ width: "100%", border: 0, height: 500 }} title="Email preview" sandbox="allow-same-origin" />
    </div>
  );
}

// ─── Email Settings Panel ────────────────────────────────────────────────────
function EmailSettingsPanel({ jwt }: { jwt: string }) {
  const [settings, setSettings] = useState<EmailSettings>(EMAIL_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [testError, setTestError] = useState("");
  const [activeTab, setActiveTab] = useState<"smtp" | "screening" | "payment" | "design" | "preview">("smtp");

  useEffect(() => {
    fetch("/api/admin/email-settings", { headers: { Authorization: `Bearer ${jwt}` } })
      .then(r => r.json())
      .then(d => {
        if (d && d.smtp_host !== undefined) {
          setSettings({
            fromName: d.from_name || EMAIL_DEFAULTS.fromName,
            fromEmail: d.from_email || "",
            smtpHost: d.smtp_host || "",
            smtpPort: d.smtp_port || 587,
            smtpUser: d.smtp_user || "",
            smtpPass: d.smtp_pass || "",
            smtpSecure: d.smtp_secure ?? false,
            screeningSubject: d.screening_subject || EMAIL_DEFAULTS.screeningSubject,
            screeningBody: d.screening_body || EMAIL_DEFAULTS.screeningBody,
            paymentSubject: d.payment_subject || EMAIL_DEFAULTS.paymentSubject,
            paymentBody: d.payment_body || EMAIL_DEFAULTS.paymentBody,
            autoSend: d.auto_send ?? false,
            primaryColor: d.primary_color || "#C9A84C",
            logoUrl: d.logo_url || "",
            headerText: d.header_text || "Iveta Clarke",
            footerText: d.footer_text || "",
            bgTint: d.bg_tint ?? false,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [jwt]);

  const set = (key: keyof EmailSettings, value: string | number | boolean) =>
    setSettings(s => ({ ...s, [key]: value }));

  const handleSave = async () => {
    setSaving(true); setSaved(false); setSaveError("");
    try {
      const res = await fetch("/api/admin/email-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify(settings),
      });
      if (!res.ok) { const d = await res.json(); setSaveError(d.error || "Chyba při ukládání"); }
      else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch { setSaveError("Síťová chyba"); }
    setSaving(false);
  };

  const handleTest = async () => {
    if (!testEmail) return;
    setTestStatus("sending"); setTestError("");
    try {
      const res = await fetch("/api/admin/email-settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ toEmail: testEmail }),
      });
      const d = await res.json();
      if (!res.ok) { setTestStatus("error"); setTestError(d.error || "Chyba"); }
      else { setTestStatus("sent"); setTimeout(() => setTestStatus("idle"), 4000); }
    } catch { setTestStatus("error"); setTestError("Síťová chyba"); }
  };

  const TABS = [
    { id: "smtp", label: "SMTP" },
    { id: "screening", label: "Screening mail" },
    { id: "payment", label: "Platební odkaz" },
    { id: "design", label: "Design" },
    { id: "preview", label: "Náhled" },
  ] as const;

  const PRESET_COLORS = [
    { label: "Zlatá (výchozí)", value: "#C9A84C" },
    { label: "Zelená", value: "#4a7c59" },
    { label: "Modrá", value: "#1d4ed8" },
    { label: "Fialová", value: "#7c3aed" },
    { label: "Tmavá", value: "#2C2C3E" },
  ];

  const inp: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${C.sand}`, background: C.white,
    fontSize: 13, fontFamily: "Georgia, serif", color: C.text,
    outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif",
    letterSpacing: "0.08em", display: "block", marginBottom: 5,
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: C.muted, fontFamily: "Trebuchet MS, sans-serif", fontSize: 13 }}>Načítání…</div>;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 32px" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: "normal", margin: "0 0 6px", color: C.dark }}>Nastavení e-mailů</h2>
        <p style={{ fontSize: 13, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", margin: 0 }}>Konfigurace SMTP serveru a šablon e-mailů odesílaných zákazníkům.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `2px solid ${C.sand}`, marginBottom: 24, gap: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: "10px 18px", background: "none", border: "none",
            borderBottom: `2px solid ${activeTab === t.id ? C.gold : "transparent"}`,
            marginBottom: -2, cursor: "pointer",
            fontSize: 13, fontFamily: "Trebuchet MS, sans-serif",
            color: activeTab === t.id ? C.gold : C.muted,
            transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ background: C.white, border: `1px solid ${C.sand}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>

        {/* ── SMTP ── */}
        {activeTab === "smtp" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={lbl}>JMÉNO ODESÍLATELE</label>
                <input value={settings.fromName} onChange={e => set("fromName", e.target.value)} placeholder="Iveta Clarke" style={inp} />
              </div>
              <div>
                <label style={lbl}>E-MAIL ODESÍLATELE</label>
                <input type="email" value={settings.fromEmail} onChange={e => set("fromEmail", e.target.value)} placeholder="info@ivetaclarke.com" style={inp} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: 12 }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>SMTP HOST</label>
                <input value={settings.smtpHost} onChange={e => set("smtpHost", e.target.value)} placeholder="smtp.gmail.com" style={inp} />
              </div>
              <div>
                <label style={lbl}>PORT</label>
                <input type="number" value={settings.smtpPort} onChange={e => set("smtpPort", parseInt(e.target.value) || 587)} style={inp} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={lbl}>SMTP UŽIVATEL</label>
                <input value={settings.smtpUser} onChange={e => set("smtpUser", e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>SMTP HESLO</label>
                <div style={{ position: "relative" }}>
                  <input type={showPass ? "text" : "password"} value={settings.smtpPass}
                    onChange={e => set("smtpPass", e.target.value)} placeholder="••••••••"
                    style={{ ...inp, paddingRight: 36 }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14 }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.text, fontFamily: "Trebuchet MS, sans-serif" }}>
              <input type="checkbox" checked={settings.smtpSecure} onChange={e => set("smtpSecure", e.target.checked)} style={{ width: 16, height: 16 }} />
              SSL/TLS (port 465)
            </label>

            {/* Test */}
            <div style={{ paddingTop: 16, borderTop: `1px solid ${C.sand}` }}>
              <label style={lbl}>TESTOVACÍ ODESLÁNÍ</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)}
                  placeholder="test@email.cz" style={{ ...inp, maxWidth: 280 }} />
                <button onClick={handleTest} disabled={testStatus === "sending" || !testEmail}
                  style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${testStatus === "sent" ? C.green : C.sand}`, background: testStatus === "sent" ? "rgba(76,175,124,0.1)" : C.cream, color: testStatus === "sent" ? C.green : C.text, fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {testStatus === "sending" ? "Odesílám…" : testStatus === "sent" ? "Odesláno ✓" : "Poslat test"}
                </button>
              </div>
              {testStatus === "error" && <div style={{ marginTop: 8, fontSize: 12, color: C.red, fontFamily: "Trebuchet MS, sans-serif" }}>{testError}</div>}
            </div>
          </div>
        )}

        {/* ── Screening mail ── */}
        {activeTab === "screening" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", padding: "8px 12px", background: C.warm, borderRadius: 8 }}>
              Tokeny: <code style={{ marginLeft: 4 }}>{"{customerName}"}</code>
              {" — odesílá se zákazníkovi po zaplacení screeningového poplatku."}
            </div>
            <div>
              <label style={lbl}>PŘEDMĚT</label>
              <input value={settings.screeningSubject} onChange={e => set("screeningSubject", e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>TEXT E-MAILU</label>
              <textarea value={settings.screeningBody} onChange={e => set("screeningBody", e.target.value)}
                rows={10} style={{ ...inp, resize: "vertical", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 }} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.text, fontFamily: "Trebuchet MS, sans-serif" }}>
              <input type="checkbox" checked={settings.autoSend} onChange={e => set("autoSend", e.target.checked)} style={{ width: 16, height: 16 }} />
              Automaticky odeslat po přijetí platby přes ComGate
            </label>
          </div>
        )}

        {/* ── Platební odkaz ── */}
        {activeTab === "payment" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", padding: "8px 12px", background: C.warm, borderRadius: 8 }}>
              Tokeny: <code>{"{customerName}"}</code> <code>{"{productName}"}</code> <code>{"{amount}"}</code> <code>{"{link}"}</code>
              {" — odesílá se zákazníkovi, když z admin panelu pošlete platební odkaz."}
            </div>
            <div>
              <label style={lbl}>PŘEDMĚT</label>
              <input value={settings.paymentSubject} onChange={e => set("paymentSubject", e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>TEXT E-MAILU</label>
              <textarea value={settings.paymentBody} onChange={e => set("paymentBody", e.target.value)}
                rows={12} style={{ ...inp, resize: "vertical", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 }} />
            </div>
          </div>
        )}

        {/* ── Design ── */}
        {activeTab === "design" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={lbl}>BARVA ZÁHLAVÍ</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {PRESET_COLORS.map(pc => (
                  <button key={pc.value} onClick={() => set("primaryColor", pc.value)} title={pc.label}
                    style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${settings.primaryColor === pc.value ? C.dark : "transparent"}`, background: pc.value, cursor: "pointer", outline: "none", transition: "transform 0.1s", transform: settings.primaryColor === pc.value ? "scale(1.15)" : "scale(1)" }} />
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="color" value={settings.primaryColor} onChange={e => set("primaryColor", e.target.value)}
                    style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.sand}`, cursor: "pointer", padding: 0 }} title="Vlastní barva" />
                  <span style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>Vlastní</span>
                </div>
              </div>
              <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: settings.primaryColor }} />
            </div>

            <div>
              <label style={lbl}>TEXT V ZÁHLAVÍ</label>
              <input value={settings.headerText} onChange={e => set("headerText", e.target.value)} placeholder="Iveta Clarke" style={inp} />
              <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", marginTop: 4 }}>Zobrazí se v barevné hlavičce. Pokud nevyplníte, použije se "Iveta Clarke".</div>
            </div>

            <div>
              <label style={lbl}>LOGO URL</label>
              <input value={settings.logoUrl} onChange={e => set("logoUrl", e.target.value)} placeholder="https://ivetaclarke.com/logo.png" style={inp} />
              <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", marginTop: 4 }}>Pokud vyplníte, logo nahradí text záhlaví.</div>
              {settings.logoUrl && (
                <div style={{ marginTop: 10, padding: 12, background: settings.primaryColor, borderRadius: 8, display: "inline-block" }}>
                  <img src={settings.logoUrl} alt="Logo" style={{ maxHeight: 48, maxWidth: 200, objectFit: "contain" }} />
                </div>
              )}
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "12px 14px", background: C.warm, borderRadius: 10, border: `1px solid ${C.sand}` }}>
              <input type="checkbox" checked={settings.bgTint} onChange={e => set("bgTint", e.target.checked)} style={{ width: 16, height: 16, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, color: C.dark, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold" }}>Barevné pozadí</div>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", marginTop: 3 }}>Celý e-mail dostane jemný odstín zvolené barvy.</div>
              </div>
              {settings.bgTint && (
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                  {[0.92, 0.93, 0.97].map((t, i) => (
                    <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: tintColor(settings.primaryColor, t) }} />
                  ))}
                </div>
              )}
            </label>

            <div>
              <label style={lbl}>TEXT PATIČKY</label>
              <input value={settings.footerText} onChange={e => set("footerText", e.target.value)}
                placeholder="Tato zpráva byla vygenerována automaticky." style={inp} />
            </div>
          </div>
        )}

        {/* ── Náhled ── */}
        {activeTab === "preview" && <EmailPreview s={settings} />}
      </div>

      {saveError && <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 9, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", background: "rgba(200,80,80,0.08)", color: C.red, border: `1px solid rgba(200,80,80,0.3)` }}>{saveError}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: "12px 28px", borderRadius: 12, background: saved ? C.green : `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, border: "none", color: saved ? C.white : C.darker, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold", letterSpacing: "0.06em", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Ukládám…" : saved ? "Uloženo ✓" : "Uložit nastavení"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const [jwt, setJwt] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [accessError, setAccessError] = useState("");
  const [requests, setRequests] = useState<ScreeningRequest[]>([]);
  const [selected, setSelected] = useState<ScreeningRequest | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [selectedPkg, setSelectedPkg] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [section, setSection] = useState<"requests" | "emails">("requests");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        setAccessError("Nejste přihlášeni. Přihlaste se nejprve na hlavní stránce.");
        setIsAdmin(false); setLoading(false); return;
      }
      const token = session.access_token;
      setJwt(token);
      try {
        const res = await fetch("/api/admin/screening", { headers: { Authorization: `Bearer ${token}` } });
        const text = await res.text();
        let data: { requests?: ScreeningRequest[]; error?: string } = {};
        try { data = JSON.parse(text); } catch { /**/ }

        if (res.status === 403) {
          setAccessError(`Přístup odepřen (403).\nEmail: ${session.user.email}\nID: ${session.user.id}\nReason: ${data.error ?? "—"}\n\nUjistěte se, že v tabulce profiles máte role='admin' pro toto user ID.`);
          setIsAdmin(false); setLoading(false); return;
        }
        if (!res.ok) {
          setAccessError(`Chyba serveru (${res.status}).\nResponse: ${text.slice(0, 300)}`);
          setIsAdmin(false); setLoading(false); return;
        }
        setIsAdmin(true);
        setRequests(data.requests ?? []);
      } catch (e) {
        setAccessError(`Síťová chyba: ${e}`);
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  const reload = useCallback(async () => {
    if (!jwt) return;
    const res = await fetch("/api/admin/screening", { headers: { Authorization: `Bearer ${jwt}` } });
    if (res.ok) { const d = await res.json(); setRequests(d.requests ?? []); }
  }, [jwt]);

  const openDetail = (r: ScreeningRequest) => {
    setSelected(r); setAdminNotes(r.admin_notes ?? ""); setSelectedPkg(""); setSendMsg(null);
  };

  const handleSendPayment = async () => {
    if (!selected || !selectedPkg || !jwt) return;
    setSending(true); setSendMsg(null);
    const res = await fetch("/api/admin/send-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ screeningRequestId: selected.id, packageId: selectedPkg }),
    });
    const data = await res.json();
    setSending(false);
    if (data.ok) {
      setSendMsg({ ok: true, text: "Platební odkaz byl odeslán zákazníkovi e-mailem." });
      await reload(); setSelected(prev => prev ? { ...prev, status: "payment_sent" } : null);
    } else {
      setSendMsg({ ok: false, text: data.error ?? "Nastala chyba." });
    }
  };

  const handleMarkDone = async (status: string) => {
    if (!selected || !jwt) return;
    await fetch("/api/admin/screening", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ id: selected.id, status }),
    });
    setSelected(prev => prev ? { ...prev, status } : null);
    await reload();
  };

  const handleSaveNotes = async () => {
    if (!selected || !jwt) return;
    setSavingNotes(true);
    await fetch("/api/admin/screening", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ id: selected.id, admin_notes: adminNotes }),
    });
    setSavingNotes(false);
    setSelected(prev => prev ? { ...prev, admin_notes: adminNotes } : null);
    await reload();
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${C.sand}`, background: C.cream,
    fontSize: 13, fontFamily: "Georgia, serif", color: C.text,
    outline: "none", boxSizing: "border-box",
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream }}>
      <div style={{ fontSize: 14, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>Načítání…</div>
    </div>
  );

  if (isAdmin === false) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream, flexDirection: "column", gap: 16, padding: 24 }}>
      <div style={{ fontSize: 18, color: C.dark }}>Přístup odepřen</div>
      {accessError && (
        <div style={{ maxWidth: 480, padding: "14px 18px", background: "rgba(200,80,80,0.07)", borderRadius: 12, border: "1px solid rgba(200,80,80,0.25)", fontSize: 13, color: C.red, fontFamily: "Trebuchet MS, sans-serif", lineHeight: 1.6, textAlign: "center", whiteSpace: "pre-line" }}>
          {accessError}
        </div>
      )}
      <a href="/" style={{ fontSize: 13, color: C.gold, fontFamily: "Trebuchet MS, sans-serif" }}>← Zpět na web</a>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, serif", background: C.cream, minHeight: "100vh", color: C.text }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${C.sand}`, padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.cream, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 13, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", textDecoration: "none" }}>← Web</a>
          <div style={{ width: 1, height: 16, background: C.sand }} />
          {/* Section nav */}
          {(["requests", "emails"] as const).map(s => (
            <button key={s} onClick={() => { setSection(s); setSelected(null); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", color: section === s ? C.dark : C.muted, borderBottom: `2px solid ${section === s ? C.gold : "transparent"}`, transition: "all 0.15s" }}>
              {s === "requests" ? "Screening žádosti" : "Nastavení e-mailů"}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif" }}>
          {section === "requests" ? `${requests.length} žádostí celkem` : "SMTP & šablony"}
        </div>
      </nav>

      {/* Email settings section */}
      {section === "emails" && jwt && <EmailSettingsPanel jwt={jwt} />}

      {/* Screening requests section */}
      {section === "requests" && (
        <div style={{ display: "flex", maxWidth: 1300, margin: "0 auto", minHeight: "calc(100vh - 54px)" }}>
          {/* Left: list */}
          <div style={{ width: selected ? 380 : "100%", flexShrink: 0, borderRight: selected ? `1px solid ${C.sand}` : "none", padding: "24px 20px" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {[
                { key: "all", label: "Vše" },
                { key: "pending", label: "Čeká" },
                { key: "screening_paid", label: "Zaplaceno" },
                { key: "screening_done", label: "Proběhl" },
                { key: "payment_sent", label: "Odkaz odeslán" },
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                  padding: "5px 12px", borderRadius: 16, fontSize: 11,
                  fontFamily: "Trebuchet MS, sans-serif",
                  background: filter === f.key ? C.gold : "transparent",
                  border: `1px solid ${filter === f.key ? C.gold : C.sand}`,
                  color: filter === f.key ? C.darker : C.muted,
                  cursor: "pointer",
                }}>{f.label}</button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "32px 0", textAlign: "center", color: C.muted, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif" }}>Žádné žádosti</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map(r => {
                  const st = STATUS_LABELS[r.status] ?? { label: r.status, color: C.muted };
                  const isActive = selected?.id === r.id;
                  return (
                    <div key={r.id} onClick={() => openDetail(r)} style={{
                      padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                      background: isActive ? C.warm : C.white,
                      border: `1px solid ${C.sand}`,
                      boxShadow: isActive ? "none" : "0 2px 8px rgba(44,44,62,0.04)",
                      transition: "all 0.15s",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 14, color: C.dark, marginBottom: 2 }}>{r.user_name}</div>
                          <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>{r.user_email}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          <div style={{ fontSize: 10, fontFamily: "Trebuchet MS, sans-serif", padding: "2px 8px", borderRadius: 10, background: `${st.color}18`, color: st.color, fontWeight: "bold", whiteSpace: "nowrap" }}>{st.label}</div>
                          <div style={{ fontSize: 10, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>{r.screening_type === "free" ? "Výcvik (zdarma)" : "Placený screening"}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", marginTop: 6 }}>
                        {new Date(r.created_at).toLocaleDateString("cs-CZ")}
                        {r.preferred_product_label && ` · ${r.preferred_product_label}`}
                        {r.preferred_workshop_variant_label && ` · ${r.preferred_workshop_variant_label}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: detail */}
          {selected && (
            <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: "normal", margin: "0 0 4px" }}>{selected.user_name}</h2>
                  <div style={{ fontSize: 13, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>{selected.user_email} · {selected.phone ?? "—"}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: `1px solid ${C.sand}`, borderRadius: 20, padding: "5px 12px", fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", color: C.muted, cursor: "pointer" }}>Zavřít</button>
              </div>

              {(() => {
                const st = STATUS_LABELS[selected.status] ?? { label: selected.status, color: C.muted };
                return (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", padding: "4px 12px", borderRadius: 12, background: `${st.color}18`, color: st.color, fontWeight: "bold" }}>{st.label}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>
                      {selected.screening_type === "free" ? "Výcvik — screening ZDARMA" : "Konzultace/koučink — screening 2 999 Kč"}
                    </div>
                  </div>
                );
              })()}

              {/* Questionnaire */}
              <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.sand}`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 16 }}>DOTAZNÍK</div>
                {selected.screening_type === "paid" ? (
                  <>
                    <QA label="Zájem o produkt" value={selected.preferred_product_label} />
                    <QA label="Proč vás zajímá koučink?" value={selected.why_interested} />
                    <QA label="Zkušenosti s koučinkem/terapií" value={selected.previous_experience} />
                    <QA label="Co chce zákazník řešit" value={selected.goals} />
                  </>
                ) : (
                  <>
                    <QA label="Varianta výcviku" value={selected.preferred_workshop_variant_label} />
                    <QA label="Proč zájem o výcvik?" value={selected.workshop_motivation} />
                    <QA label="Zkušenosti s koučinkem" value={selected.workshop_background} />
                    <QA label="Délka praxe" value={selected.workshop_experience} />
                  </>
                )}
              </div>

              {/* Send payment */}
              {selected.status !== "cancelled" && (
                <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.sand}`, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 16 }}>ODESLAT PLATEBNÍ ODKAZ</div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>VYBERTE PRODUKT</label>
                    <select value={selectedPkg} onChange={e => setSelectedPkg(e.target.value)} style={{ ...inputStyle, background: C.cream }}>
                      <option value="">— zvolte produkt —</option>
                      {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.label} — {p.price}</option>)}
                    </select>
                  </div>
                  {selectedPkg && (
                    <div style={{ fontSize: 12, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", marginBottom: 16, padding: "8px 12px", background: C.cream, borderRadius: 8 }}>
                      {["3m", "6m", "12m"].includes(selectedPkg) && selected.screening_paid_at
                        ? "Poplatek za screening (2 999 Kč) bude automaticky odečten z ceny produktu."
                        : "Zákazník zaplatí plnou cenu produktu."}
                    </div>
                  )}
                  <button onClick={handleSendPayment} disabled={!selectedPkg || sending}
                    style={{ padding: "12px 24px", borderRadius: 24, background: selectedPkg ? C.gold : C.sand, border: "none", color: selectedPkg ? C.darker : C.muted, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold", cursor: selectedPkg ? "pointer" : "not-allowed", opacity: sending ? 0.7 : 1 }}>
                    {sending ? "Odesílám…" : "Odeslat platební odkaz zákazníkovi"}
                  </button>
                  {sendMsg && (
                    <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 9, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", background: sendMsg.ok ? "rgba(76,175,124,0.08)" : "rgba(200,80,80,0.08)", color: sendMsg.ok ? C.green : C.red, border: `1px solid ${sendMsg.ok ? "rgba(76,175,124,0.3)" : "rgba(200,80,80,0.3)"}` }}>
                      {sendMsg.text}
                    </div>
                  )}
                </div>
              )}

              {/* Status actions */}
              <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.sand}`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 16 }}>SPRÁVA STAVU</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selected.status === "pending" && selected.screening_type === "free" && (
                    <ActionBtn onClick={() => handleMarkDone("screening_done")} label="Označit: screening proběhl" />
                  )}
                  {selected.status === "screening_paid" && (
                    <ActionBtn onClick={() => handleMarkDone("screening_done")} label="Označit: screening proběhl" />
                  )}
                  {selected.status !== "completed" && selected.status !== "cancelled" && (
                    <ActionBtn onClick={() => handleMarkDone("completed")} label="Označit: dokončeno" color={C.green} />
                  )}
                  {selected.status !== "cancelled" && (
                    <ActionBtn onClick={() => handleMarkDone("cancelled")} label="Zrušit" color={C.red} />
                  )}
                </div>
              </div>

              {/* Admin notes */}
              <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.sand}` }}>
                <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 12 }}>POZNÁMKY (INTERNÍ)</div>
                <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={4}
                  style={{ ...inputStyle, resize: "vertical" }} placeholder="Poznámky k zákazníkovi, domluvené termíny apod." />
                <button onClick={handleSaveNotes} disabled={savingNotes}
                  style={{ marginTop: 10, padding: "8px 20px", borderRadius: 20, background: C.gold, border: "none", color: C.darker, fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold", cursor: "pointer", opacity: savingNotes ? 0.7 : 1 }}>
                  {savingNotes ? "Ukládám…" : "Uložit poznámky"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QA({ label, value }: { label: string; value?: string | null }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.08em", marginBottom: 3 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{value || "—"}</div>
    </div>
  );
}

function ActionBtn({ onClick, label, color = C.muted }: { onClick: () => void; label: string; color?: string }) {
  return (
    <button onClick={onClick} style={{ padding: "8px 16px", borderRadius: 20, border: `1px solid ${color}`, background: "transparent", color, fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", cursor: "pointer" }}>
      {label}
    </button>
  );
}
