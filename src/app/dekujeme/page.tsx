"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const C = {
  cream:   "#FAF8F4",
  gold:    "#C9A84C",
  dark:    "#2C2C3E",
  darker:  "#1E1E2E",
  text:    "#3A3530",
  muted:   "#8A8070",
  white:   "#FFFFFF",
};

function ThankYouContent() {
  const params  = useSearchParams();
  const ref     = params.get("ref");
  const status  = params.get("status");
  const isPaid  = status === "paid";

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${C.darker} 0%, #3A2C4E 55%, ${C.dark} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", fontFamily: "Georgia, serif",
    }}>
      <div style={{
        background: C.cream, borderRadius: 24, maxWidth: 520, width: "100%",
        padding: "48px 44px", textAlign: "center",
        boxShadow: "0 32px 80px rgba(0,0,0,0.36)",
      }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: isPaid ? "rgba(201,168,76,0.12)" : "rgba(200,80,80,0.1)",
          border: `2px solid ${isPaid ? C.gold : "#C85050"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px", fontSize: 28,
        }}>
          {isPaid ? "✓" : "×"}
        </div>

        {isPaid ? (
          <>
            <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 16 }}>
              PLATBA PROBĚHLA ÚSPĚŠNĚ
            </div>
            <h1 style={{ fontSize: 30, fontWeight: "normal", color: C.dark, margin: "0 0 16px", lineHeight: 1.2 }}>
              Děkujeme!
            </h1>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 12 }}>
              Vaše platba byla přijata. Potvrzení a fakturu obdržíte e-mailem.
            </p>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
              Brzy se vám ozvu s dalšími kroky a přístupem ke kalendáři.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 11, color: "#C85050", letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 16 }}>
              PLATBA BYLA ZRUŠENA
            </div>
            <h1 style={{ fontSize: 30, fontWeight: "normal", color: C.dark, margin: "0 0 16px", lineHeight: 1.2 }}>
              Platba nebyla dokončena
            </h1>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
              Pokud došlo k chybě, zkuste to prosím znovu nebo mě kontaktujte přímo.
            </p>
          </>
        )}

        {ref && (
          <div style={{
            background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.2)`,
            borderRadius: 10, padding: "10px 16px", marginBottom: 32,
            fontSize: 12, color: C.muted, fontFamily: "Trebuchet MS, sans-serif",
          }}>
            Reference platby: <span style={{ color: C.dark, fontWeight: "bold" }}>{ref}</span>
          </div>
        )}

        {/* Gold divider */}
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, marginBottom: 28 }} />

        <a href="/" style={{
          display: "inline-block", padding: "13px 32px",
          background: C.gold, borderRadius: 32,
          color: C.darker, fontSize: 13, fontFamily: "Trebuchet MS, sans-serif",
          fontWeight: "bold", textDecoration: "none", letterSpacing: "0.06em",
        }}>
          Zpět na hlavní stránku
        </a>

        <div style={{ marginTop: 24, fontSize: 13, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>
          Máte otázky?{" "}
          <a href="/#kontakt" style={{ color: C.gold, textDecoration: "none" }}>Kontaktujte mě →</a>
        </div>
      </div>
    </div>
  );
}

export default function DekujemePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#1E1E2E" }} />}>
      <ThankYouContent />
    </Suspense>
  );
}
