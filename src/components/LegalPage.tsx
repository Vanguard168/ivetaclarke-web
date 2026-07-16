import Link from "next/link";
import React from "react";

export const company = {
  name: "ReDefine s.r.o.",
  address: "Ztracená 1393, 250 01 Brandýs nad Labem-Stará Boleslav",
  ico: "03786552",
  dic: "CZ03786552",
  email: "info@ivetaclarke.com",
  web: "https://ivetaclarke.com",
};

const gold = "#C9A84C";
const dark = "#2C2C3E";
const text = "#3A3530";
const muted = "#8A8070";
const cream = "#FAF8F4";

export function LegalPage({ title, subtitle, children }: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: cream, minHeight: "100vh", fontFamily: "Georgia, serif", color: text }}>
      {/* Gold top bar */}
      <div style={{ height: 4, background: `linear-gradient(to right, ${gold}, #DFC06A)` }} />

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(201,168,76,0.18)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: 15, color: dark, textDecoration: "none", fontWeight: "normal" }}>
            Iveta Clarke
          </Link>
          <Link href="/" style={{ fontSize: 12, color: muted, textDecoration: "none", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.03em" }}>
            ← Zpět na hlavní stránku
          </Link>
        </div>
      </div>

      {/* Page heading */}
      <div style={{ background: dark, padding: "48px 24px 44px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 10, color: gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 12 }}>
            {company.name} · IČO {company.ico}
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: "normal", color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>
            {title}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontFamily: "Trebuchet MS, sans-serif", margin: 0 }}>{subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px 24px 80px" }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{ background: dark, borderTop: `3px solid ${gold}`, padding: "32px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "Trebuchet MS, sans-serif" }}>
            {company.name} · IČO: {company.ico} · DIČ: {company.dic} · {company.address}
          </div>
          <Link href="/" style={{ fontSize: 11, color: gold, textDecoration: "none", fontFamily: "Trebuchet MS, sans-serif" }}>
            ivetaclarke.com
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Shared prose styles ──────────────────────────────────────────────────── */

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <h2 style={{ fontSize: 20, fontWeight: "normal", color: dark, margin: "0 0 18px", paddingBottom: 10, borderBottom: `2px solid rgba(201,168,76,0.25)` }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 14.5, lineHeight: 1.85, color: text, margin: "0 0 12px" }}>{children}</p>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>{children}</ul>
  );
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ fontSize: 14.5, lineHeight: 1.85, color: text, marginBottom: 6 }}>{children}</li>
  );
}

export function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 12, padding: "18px 22px", marginBottom: 28 }}>
      {children}
    </div>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 15, fontWeight: "bold", color: dark, margin: "20px 0 8px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.03em" }}>
      {children}
    </h3>
  );
}
