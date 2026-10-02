"use client";
import { useState, useEffect } from "react";
import { hasNewZamyslnik2 } from "@/lib/podcast";

const links = [
  {
    id: "web",
    href: "https://ivetaclarke.com",
    label: "ivetaclarke.com",
    description: "Chcete se o mě dozvědět více? Prozkoumejte můj nový web.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: "masterclass",
    href: "https://ivetaclarke.com/masterclass",
    label: "Masterclass pro kouče – Průvodcem v midlife®",
    description: "Nejbližší termín: 13.–14. 11. 2026",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "zamyslnik2",
    href: "https://www.youtube.com/@IvetaClarke",
    label: "Zámyslník 2.0 – Moudrost je",
    description: "Hloubkové rozhovory o moudrosti, životě a proměně. S hosty a na videu.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

function LinkCard({ href, label, description, icon, badge }: typeof links[0] & { badge?: string }) {
  const [hover, setHover] = useState(false);
  const highlight = !!badge;
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      // pulzuje jen dokud je díl nový a kurzor není na kartě
      className={highlight && !hover ? "pulse-card" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 24px",
        borderRadius: 16,
        border: `1.5px solid ${hover ? "#C9A84C" : "rgba(201,168,76,0.25)"}`,
        background: hover ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
        textDecoration: "none",
        transition: "all 0.2s ease",
        cursor: "pointer",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 8px 32px rgba(201,168,76,0.12)" : "none",
      }}
    >
      <span style={{ color: "#C9A84C", flexShrink: 0, display: "flex" }}>{icon}</span>
      <span style={{ flex: 1 }}>
        {badge && (
          <span className="pulse-badge" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
            color: "#1E1E2E", fontSize: 10, fontFamily: "Trebuchet MS, sans-serif",
            fontWeight: "bold", letterSpacing: "0.12em",
            padding: "3px 9px", borderRadius: 20, marginBottom: 6,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#1E1E2E", flexShrink: 0 }} />
            {badge}
          </span>
        )}
        <span style={{ display: "block", color: "#FFFFFF", fontSize: 17, fontFamily: "Georgia, serif", fontWeight: "normal", letterSpacing: "0.01em" }}>
          {label}
        </span>
        <span style={{ display: "block", color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", marginTop: 2, letterSpacing: "0.03em" }}>
          {description}
        </span>
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "transform 0.2s", transform: hover ? "translateX(3px)" : "none" }}>
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  );
}

export default function LinksPage() {
  // Vyhodnotí se až po mountu, aby se server a klient nelišily při hydrataci.
  const [newEpisode, setNewEpisode] = useState(false);
  useEffect(() => { setNewEpisode(hasNewZamyslnik2()); }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1E1E2E",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "Georgia, serif",
    }}>
      <style>{`
        @keyframes cardPulse {
          0%, 100% { border-color: rgba(201,168,76,0.25); box-shadow: 0 0 0 0 rgba(201,168,76,0); }
          50%      { border-color: #E8C96A;              box-shadow: 0 0 26px 2px rgba(201,168,76,0.35); }
        }
        @keyframes badgePulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        .pulse-card  { animation: cardPulse  1.8s ease-in-out infinite; }
        .pulse-badge { animation: badgePulse 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pulse-card, .pulse-badge { animation: none; }
        }
      `}</style>

      {/* Gold accent line */}
      <div style={{ width: 48, height: 3, background: "linear-gradient(to right, #C9A84C, #E8C96A)", borderRadius: 2, marginBottom: 32 }} />

      {/* Photo */}
      <div style={{
        width: 96, height: 96, borderRadius: "50%",
        border: "2px solid #C9A84C",
        overflow: "hidden",
        marginBottom: 20,
        flexShrink: 0,
      }}>
        <img src="/iveta-photo.jpg" alt="Iveta Clarke" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
      </div>

      {/* Name & tagline */}
      <h1 style={{ color: "#FFFFFF", fontSize: 26, fontWeight: "normal", margin: "0 0 6px", letterSpacing: "0.02em", textAlign: "center" }}>
        Iveta Clarke
      </h1>
      <p style={{ color: "#C9A84C", fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.18em", margin: "0 0 40px", textAlign: "center", textTransform: "uppercase" }}>
        Profesionální kouč &amp; mentor
      </p>

      {/* Links */}
      <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 14 }}>
        {links.map((l) => (
          <LinkCard
            key={l.href}
            {...l}
            badge={l.id === "zamyslnik2" && newEpisode ? "NOVÝ DÍL" : undefined}
          />
        ))}
      </div>

      {/* Footer */}
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", marginTop: 48, letterSpacing: "0.05em" }}>
        ivetaclarke.com
      </p>
    </div>
  );
}
