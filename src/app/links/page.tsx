"use client";
import { useState } from "react";

const links = [
  {
    href: "https://ivetaclarke.com",
    label: "Web",
    description: "ivetaclarke.com",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    href: "https://ivetaclarke.com/masterclass",
    label: "Masterclass",
    description: "Průvodcem v midlife®",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@ivetaclarke",
    label: "Podcast na YouTube",
    description: "Každopádně k ladně",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

function LinkCard({ href, label, description, icon }: typeof links[0]) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
          <LinkCard key={l.href} {...l} />
        ))}
      </div>

      {/* Footer */}
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "Trebuchet MS, sans-serif", marginTop: 48, letterSpacing: "0.05em" }}>
        ivetaclarke.com
      </p>
    </div>
  );
}
