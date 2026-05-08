import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Iveta Clarke – Rozhovor s přesahem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "linear-gradient(160deg, #1E1E2E 0%, #3A2C4E 55%, #2C2C3E 100%)",
          position: "relative",
          overflow: "hidden",
          padding: "0 80px 72px",
        }}
      >
        {/* Dandelion stems */}
        <svg
          width="600" height="630"
          viewBox="0 0 600 630"
          style={{ position: "absolute", right: 0, bottom: 0, opacity: 0.35 }}
        >
          {/* Tall stem */}
          <line x1="380" y1="630" x2="320" y2="120" stroke="#C9A84C" strokeWidth="1.5" />
          {/* Medium stem */}
          <line x1="460" y1="630" x2="430" y2="220" stroke="#C9A84C" strokeWidth="1.5" />
          {/* Short stem */}
          <line x1="520" y1="630" x2="510" y2="350" stroke="#C9A84C" strokeWidth="1.2" />

          {/* Head 1 – tall */}
          {[...Array(18)].map((_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const r = 55;
            return (
              <line key={i}
                x1={320} y1={120}
                x2={320 + Math.cos(angle) * r}
                y2={120 + Math.sin(angle) * r}
                stroke="#C9A84C" strokeWidth="1" opacity="0.9"
              />
            );
          })}
          {/* Head 2 – medium */}
          {[...Array(14)].map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const r = 38;
            return (
              <line key={i}
                x1={430} y1={220}
                x2={430 + Math.cos(angle) * r}
                y2={220 + Math.sin(angle) * r}
                stroke="#C9A84C" strokeWidth="0.9" opacity="0.75"
              />
            );
          })}
          {/* Head 3 – small */}
          {[...Array(10)].map((_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const r = 24;
            return (
              <line key={i}
                x1={510} y1={350}
                x2={510 + Math.cos(angle) * r}
                y2={350 + Math.sin(angle) * r}
                stroke="#C9A84C" strokeWidth="0.8" opacity="0.6"
              />
            );
          })}

          {/* Floating seeds */}
          {[[180, 80], [250, 160], [150, 250], [480, 100], [540, 200]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="2" fill="#C9A84C" opacity="0.5" />
              <line x1={x} y1={y} x2={x} y2={y - 14} stroke="#C9A84C" strokeWidth="0.7" opacity="0.4" />
              {[-8, -3, 3, 8].map((dx, j) => (
                <line key={j} x1={x} y1={y - 14} x2={x + dx} y2={y - 22} stroke="#C9A84C" strokeWidth="0.5" opacity="0.35" />
              ))}
            </g>
          ))}
        </svg>

        {/* Gold left accent */}
        <div style={{
          position: "absolute", left: 0, top: 80, bottom: 80,
          width: 3, background: "linear-gradient(to bottom, transparent, #C9A84C, transparent)",
          display: "flex",
        }} />

        {/* Tagline */}
        <div style={{
          fontSize: 13, letterSpacing: "0.3em", color: "#C9A84C",
          fontFamily: "sans-serif", marginBottom: 20, display: "flex",
        }}>
          PROFESIONÁLNÍ KOUČ, MENTOR &amp; SUPERVIZOR
        </div>

        {/* Main title */}
        <div style={{ fontSize: 72, color: "#ffffff", fontFamily: "serif", lineHeight: 1.05, marginBottom: 6, display: "flex" }}>
          Rozhovor
        </div>
        <div style={{ fontSize: 72, color: "#C9A84C", fontFamily: "serif", fontStyle: "italic", lineHeight: 1.05, marginBottom: 36, display: "flex" }}>
          s přesahem.
        </div>

        {/* Name */}
        <div style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif", letterSpacing: "0.05em", display: "flex" }}>
          Iveta Clarke · ivetaclarke.com
        </div>
      </div>
    ),
    { ...size }
  );
}
