"use client";
import React, { useState, useEffect, useRef } from "react";

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  cream: "#FAF8F4",
  warm: "#F0EBE3",
  sand: "#E8DDD0",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  dark: "#2C2C3E",
  darker: "#1E1E2E",
  text: "#3A3530",
  muted: "#8A8070",
  white: "#FFFFFF",
};

// ── Data ─────────────────────────────────────────────────────────────────────

const heroData = {
  tagline: "PROFESIONÁLNÍ KOUČ, MENTOR & SUPERVIZOR",
  title1: "Rozhovor",
  title2: "s přesahem.",
  subtitle: "Poskytuji podporu zralým lidem v labyrintu přechodových životních fází.",
  mission: "Mým posláním je zprostředkovat lidem kontakt s jejich vlastní duší. Tam nastává ten opravdový dialog a začíná cesta ke zrání.",
};

const aboutData = {
  shortBio: "Jsem zkušený certifikovaný kouč, mentor a supervizor s mezinárodní praxí a více než 25 lety zkušeností v oboru dialogické práce s lidmi. Pracuji s inteligentními a zralými lidmi, kteří více než dosažení cíle potřebují novou navigaci. Ve společném dialogu hledáme nové podněty, zdroje, směr, energii nebo impuls.",
  longBio: [
    "Jsem kvalifikovaným průvodcem lidem v labyrintu přechodových životních fází (Life Transitions) – specificky v období midlife, nebo v období významných životních zlomů (Life-Quakes).",
    "Častými průvodními jevy nebo spouštěči těchto tranzicí jsou nejistota, ztráta smyslu a směru, absence plánu nebo vize, potřeba obnovy, nové role, náročné emoce, kolapsy dlouholetých vztahů, únava oborem, kariérní strop a kariérní exit, nebo rodinná generační komplexita.",
    "Jsem také kvalifikovaným odborníkem na témata týkající se lidského studu, zranitelnosti, odvahy a práce s mocí.",
    "Ve své práci používám principy a kompetence profesionálního koučování, aplikuji supervizní a reflektivní techniky a modely, vycházím z teorie chování systémů, přináším moderní nástroje navigace v životních přechodech a sdílím vlastní zkušenosti a příběhy. Pro své klienty jsem současně podporovatelem a vyzyvatelem.",
    "Aktivně se vzdělávám nejen ve svém oboru, ale i v oborech, které pomáhají rozšiřovat kapacitu vědomí – studuji ezoterickou filosofii, kvantovou fyziku, lidské dějiny a aspekty moderní spirituality. Zabývám se intenzivně studiem lidské moudrosti a možnostmi její kultivace.",
  ],
  stats: [["25+", "let zkušeností"], ["500+", "klientů"], ["3", "specializace"]],
};

const consultationData = {
  note: "Setkání mohou být online anebo osobní, v mé kanceláři v centru Prahy. Plánujete si je sami v požadované frekvenci, dle mého plánovacího kalendáře. Ceny jsou uvedeny bez DPH. Balíčky jsou platné ode dne převodu platby na účet ReDefine s.r.o.",
  individual: [
    {
      title: "Individuální konzultace online",
      duration: "60 minut",
      price: "5 990 Kč",
      priceNote: "vč. DPH / 4 950 Kč bez DPH",
      desc: "Tento formát je vhodný pro analýzu vaší současné situace, zasazení do širšího kontextu, pojmenování základních otázek, definování vašich témat, a ošetření emocí. Výsledkem je vhled do situace, nasměrování a zklidnění.",
    },
    {
      title: "Individuální konzultace osobní",
      duration: "90 minut",
      price: "8 990 Kč",
      priceNote: "vč. DPH / 7 430 Kč bez DPH",
      desc: "Osobní setkání v mé kanceláři v centru Prahy. Prostor pro hloubkový rozhovor s přesahem, reflexi a konkrétní impulzy pro váš život.",
    },
  ],
  packages: [
    {
      id: "3m", title: "Krátkodobá spolupráce", duration: "3 měsíce", price: "24 990 Kč", priceNote: "vč. DPH / 20 653 Kč bez DPH", available: true,
      desc: "Neomezený počet setkání dle vaší potřeby, délka setkání 90 minut. Online nebo osobní dle dohody. Vhodné pro prozkoumání dilemat, vyhodnocení postojů a osvojení relevantních konceptů.",
    },
    {
      id: "6m", title: "Střednědobá spolupráce", duration: "6 měsíců", price: "44 990 Kč", priceNote: "vč. DPH / 37 182 Kč bez DPH", available: true,
      desc: "Neomezený počet setkání, délka 90 minut. Online nebo dle dohody. Umožňuje jít do větší hloubky, pracujeme s ověřenými koncepty a nástroji vedoucími ke zklidnění, úlevě a obnově energie.",
    },
    {
      id: "12m", title: "Roční spolupráce", duration: "12 měsíců", price: "74 990 Kč", priceNote: "vč. DPH / 61 975 Kč bez DPH", available: true,
      desc: "Osobní provázení vaším životním kontextem a profesionální mentoring. Neomezený počet setkání v délce 90 minut. Online nebo dle dohody. V tomto balíčku budujeme vztah – jsem vaším životním sparring partnerem.",
    },
  ],
};

const videoSeries = [
  { title: "Midlife – kompetence a postoje k životu ve středním věku", episodes: 6, free: 1 },
  { title: "Kultivace moudrosti", episodes: 6, free: 1 },
  { title: "Stud a zranitelnost", episodes: 6, free: 1 },
  { title: "Jak mluvit s lidmi (aby vás poslouchali)", episodes: 6, free: 1 },
];

const podcasts = [
  {
    name: "Zámyslník",
    type: "Autorský podcast",
    desc: "Inspirativní přemýšlení nahlas o tématech, která hýbají našimi životy.",
    episodes: "Dostupné na všech platformách",
    free: true,
  },
  {
    name: "Kód Moudrosti",
    type: "Moderovaný podcast s hosty",
    desc: "Hloubkové rozhovory s hosty o moudrosti, životě a proměně. Kick off Květen 2026.",
    episodes: "Brzy",
    free: false,
  },
];

const supervisionData = {
  intro: "Supervize je prostor k profesní i osobní reflexi a k učení z vlastních zkušeností a vhledů.",
  functions: [
    { label: "Normativní", desc: "Zaměřuje se na kvalitu a standardy práce. \u201eDělám svou práci správně?\u201c" },
    { label: "Formativní", desc: "Zaměřuje se na učení a profesní růst. \u201eJak se můžu zlepšit?\u201c" },
    { label: "Restorativní", desc: "Zaměřuje se na psychickou pohodu a zvládání zátěže. \u201eJak u toho vydržím v rovnováze?\u201c" },
  ],
  qualification: "Prošla jsem odborným supervizním výcvikem (CSA London) a mezinárodním akreditačním procesem u profesní organizace EMCC (level ESIA Senior Practitioner). ESIA ověřuje reálnou praxi v supervizi, schopnost reflektovat vlastní práci, dodržování etiky profese a kontinuální profesní rozvoj.",
  packages: [
    { title: "Ochutnávka supervize", sessions: "Jednorázové online setkání", duration: "45 min", price: "4 890 Kč", priceNote: "vč. DPH / 4 041 Kč bez DPH", icon: "◈" },
    { title: "Supervizní balíček", sessions: "6 supervizí", duration: "60 min / sezení", price: "35 990 Kč", priceNote: "vč. DPH / 29 744 Kč bez DPH", icon: "◉" },
  ],
  workshop: {
    title: "Průvodcem v midlife®",
    subtitle: "Výcvikový a supervizní workshop pro kouče",
    desc: "Workshop pro kouče, kteří ve své klientské praxi pracují s lidmi ve zlomovém životním období středního věku. Nabízím know-how z Modern Elder Academy – první školy moudrosti na světě – doplněné vším, co vím o midlife z vlastní praxe.",
    date: "Nejbližší termín: 9.–10. 10. 2026",
    earlyBird: "Early bird sleva 15 % do konce července 2026",
    maxParticipants: "Max. 12 účastníků · Prezenční, rezidenční",
    base: { label: "Základní program (2 dny)", price: "43 590 Kč", priceNote: "vč. DPH / 36 025 Kč bez DPH" },
    bonuses: [
      { label: "S bonusem Midlife supervize", price: "50 890 Kč", priceNote: "vč. DPH / 42 058 Kč bez DPH" },
      { label: "S bonusem Kultivace moudrosti", price: "59 990 Kč", priceNote: "vč. DPH / 49 579 Kč bez DPH" },
    ],
    full: { label: "Plný program včetně obou bonusů", price: "66 990 Kč", priceNote: "vč. DPH / 55 364 Kč bez DPH" },
  },
};

const navItems = ["O mně", "Konzultace", "Supervize", "Výcvik", "Videa", "Podcast", "Kontakt"];

// ── Hooks ────────────────────────────────────────────────────────────────────
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Animated section wrapper ─────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Dandelion canvas animation ────────────────────────────────────────────────
function DandelionCanvas({ targetRef }: { targetRef?: React.RefObject<HTMLDivElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;

    const start = (W: number, H: number) => {
      cancelAnimationFrame(raf);
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const N = 28;
      const sc = Math.min(W, H);
      const cx      = W > 600 ? W * 0.75  : W * 0.74;
      // desktop: květ těsně pod menu; mobil: o kousek níž
      const cy      = W > 600 ? H * 0.40  : H * 0.34;
      const stemR   = W > 600 ? sc * 0.13 : sc * 0.21;
      const groundY = W > 600 ? H * 0.90  : H * 0.80;
      const stemLen = groundY - cy;

      // Stébla trávy — x offset od cx, výška, fáze, amplituda
      const grass = [
        { dx: -sc*0.09, h: sc*0.13,  phase: 0.0,  amp: sc*0.020 },
        { dx: -sc*0.06, h: sc*0.17,  phase: 0.7,  amp: sc*0.026 },
        { dx: -sc*0.03, h: sc*0.11,  phase: 1.4,  amp: sc*0.016 },
        { dx:  sc*0.01, h: sc*0.15,  phase: 0.3,  amp: sc*0.024 },
        { dx:  sc*0.04, h: sc*0.12,  phase: 1.1,  amp: sc*0.020 },
        { dx:  sc*0.07, h: sc*0.18,  phase: 0.5,  amp: sc*0.028 },
        { dx:  sc*0.10, h: sc*0.10,  phase: 1.8,  amp: sc*0.017 },
        { dx: -sc*0.12, h: sc*0.12,  phase: 0.9,  amp: sc*0.018 },
        { dx:  sc*0.13, h: sc*0.14,  phase: 2.1,  amp: sc*0.022 },
        { dx: -sc*0.005,h: sc*0.16,  phase: 1.6,  amp: sc*0.023 },
      ];

      interface FSeed { x: number; y: number; vx: number; vy: number; rot: number; vr: number; opacity: number; aimed: boolean; }
      interface LSeed { x: number; y: number; phase: number; }
      const attached = Array(N).fill(true);
      const flying: FSeed[] = [];
      const landed: LSeed[] = [];
      let attachedN = N;
      let timer = 0;
      let nextAt = 1.6;
      let frameCount = 0;
      let launched = 0;    // počet vypuštěných celkem
      let aimedSoFar = 0;  // počet těch, co letí na tlačítko

      // Pozice tlačítka (aktualizuje se v loopě)
      let btn = { cx: W * 0.15, top: groundY, halfW: 90 };
      const readBtn = () => {
        if (!targetRef?.current) return;
        const br = targetRef.current.getBoundingClientRect();
        const cr = canvas.getBoundingClientRect();
        if (br.width === 0) return;
        btn = {
          cx:    br.left + br.width / 2 - cr.left,
          top:   br.top  - cr.top,
          halfW: br.width / 2,
        };
      };
      // první čtení po renderu
      setTimeout(readBtn, 600);
      setTimeout(readBtn, 1500);

      const drawSeed = (x: number, y: number, rot: number, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, sc * 0.008, sc * 0.003, sc * 0.01, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(230,210,170,0.95)";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -sc * 0.001);
        ctx.lineTo(0, -sc * 0.036);
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        const py = -sc * 0.036;
        const fl = sc * 0.032;
        for (let j = 0; j < 14; j++) {
          const a = ((j / 14) - 0.5) * Math.PI * 1.15;
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(Math.sin(a) * fl, py - Math.cos(a) * fl * 0.72);
          ctx.strokeStyle = "rgba(255,255,255,0.35)";
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
        ctx.restore();
      };

      let last = performance.now();
      const loop = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        timer += dt;
        frameCount++;
        // aktualizuj pozici tlačítka každých 90 snímků
        if (frameCount % 90 === 0) readBtn();
        ctx.clearRect(0, 0, W, H);

        if (timer >= nextAt && attachedN > 0) {
          const cands = Array.from({ length: N }, (_, i) => i).filter(i => attached[i]);
          const idx = cands[Math.floor(Math.random() * cands.length)];
          attached[idx] = false;
          attachedN--;
          const a = (idx / N) * Math.PI * 2;
          const sx = cx + Math.cos(a) * stemR;
          const sy = cy + Math.sin(a) * stemR;

          // přesně 6 semínek poletí na tlačítko, rovnoměrně rozloženo
          launched++;
          const remaining = N - launched;
          const aimedNeeded = 6 - aimedSoFar;
          const aimed = aimedNeeded > 0 && (aimedNeeded > remaining || Math.random() < aimedNeeded / (remaining + 1));
          if (aimed) aimedSoFar++;
          let vx: number, vy: number;
          if (aimed) {
            const tx = btn.cx + (Math.random() - 0.5) * btn.halfW * 1.2;
            const ty = btn.top;
            const frames = 220 + Math.random() * 100; // pomalejší, přirozenější let
            vx = (tx - sx) / frames;
            vy = (ty - sy) / frames;
          } else {
            const windA = W > 600
              ? a - Math.PI * 0.65 + (Math.random() - 0.3) * 1.1
              : a - Math.PI * 0.3  + (Math.random() - 0.5) * 1.0;
            const spd = sc * (W > 600 ? 0.0012 + Math.random() * 0.0007 : 0.0009 + Math.random() * 0.0006);
            vx = Math.cos(windA) * spd;
            vy = Math.sin(windA) * spd - sc * 0.0003;
          }

          flying.push({ x: sx, y: sy, vx, vy, rot: a + Math.PI / 2, vr: (Math.random() - 0.5) * 0.016, opacity: 1, aimed });
          nextAt = timer + 0.45 + Math.random() * 0.45;
        }

        if (attachedN === 0 && flying.every(s => s.opacity <= 0)) {
          for (let i = 0; i < N; i++) attached[i] = true;
          flying.length = 0;
          landed.length = 0;
          attachedN = N;
          timer = 0;
          nextAt = 2.2;
          frameCount = 0;
          launched = 0;
          aimedSoFar = 0;
        }

        // Tráva pod stonkem
        for (const b of grass) {
          const sway = Math.sin(timer * 1.4 + b.phase) * b.amp;
          const bx = cx + b.dx;
          ctx.beginPath();
          ctx.moveTo(bx, groundY);
          ctx.quadraticCurveTo(bx + sway * 0.4, groundY - b.h * 0.55, bx + sway, groundY - b.h);
          ctx.strokeStyle = "rgba(160,190,110,0.32)";
          ctx.lineWidth = 1.1;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Stonek
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, groundY);
        ctx.strokeStyle = "rgba(201,168,76,0.38)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Střed - zlatý glow
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, sc * 0.028);
        g.addColorStop(0, "rgba(201,168,76,0.9)");
        g.addColorStop(1, "rgba(201,168,76,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, sc * 0.028, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Přichycená semínka
        for (let i = 0; i < N; i++) {
          if (!attached[i]) continue;
          const a = (i / N) * Math.PI * 2;
          const ex = cx + Math.cos(a) * stemR;
          const ey = cy + Math.sin(a) * stemR;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = "rgba(255,255,255,0.18)";
          ctx.lineWidth = 0.6;
          ctx.stroke();
          drawSeed(ex, ey, a + Math.PI / 2, 0.75);
        }

        // Letící semínka
        for (const s of flying) {
          if (s.opacity <= 0) continue;

          s.x += s.vx;
          s.y += s.vy;

          if (s.aimed) {
            // Plynulá rotace stéblem dolů (rot → 0 = pappus nahoru, stéblo dolů)
            let diff = (0 - s.rot) % (Math.PI * 2);
            if (diff > Math.PI)  diff -= Math.PI * 2;
            if (diff < -Math.PI) diff += Math.PI * 2;
            s.rot += diff * 0.025;

            if (s.y >= btn.top) {
              const lx = Math.max(btn.cx - btn.halfW + 6, Math.min(btn.cx + btn.halfW - 6, s.x));
              landed.push({ x: lx, y: btn.top, phase: Math.random() * Math.PI * 2 });
              s.opacity = 0;
            }
          } else {
            s.rot += s.vr;
            s.vy -= sc * 0.000003;
            s.opacity -= W > 600 ? 0.0009 : 0.0013;
            if (s.y >= groundY) { s.opacity = 0; continue; }
          }

          if (s.opacity > 0) drawSeed(s.x, s.y, s.rot, s.opacity);
        }

        // Zapíchnutá semínka — kývají se jako tráva
        // stemAbove + pappus musí odpovídat výšce letícího semínka (beak + filament)
        const stemAbove = sc * 0.036; // = délka beaku letícího semínka
        const stemBelow = sc * 0.012; // zapíchnutá část
        for (const l of landed) {
          const sway = Math.sin(timer * 1.5 + l.phase) * 0.13; // úhel kývání
          ctx.save();
          ctx.globalAlpha = 1.0;
          ctx.translate(l.x, l.y);
          ctx.rotate(sway);

          // Zapíchnutá část (dolů do tlačítka)
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, stemBelow);
          ctx.strokeStyle = "rgba(230,210,170,0.5)";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Stéblo nad tlačítkem (nahoru)
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -stemAbove);
          ctx.strokeStyle = "rgba(255,255,255,0.75)";
          ctx.lineWidth = 0.75;
          ctx.stroke();

          // Tělo semínka (achene) tam kde vstupuje do povrchu
          ctx.beginPath();
          ctx.ellipse(0, 0, sc * 0.003, sc * 0.009, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(235,215,175,1)";
          ctx.fill();

          // Pappus — chmýří na vrcholu stébla
          const py = -stemAbove;
          const fl = sc * 0.030;
          for (let j = 0; j < 14; j++) {
            const fa = ((j / 14) - 0.5) * Math.PI * 1.25;
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(Math.sin(fa) * fl, py - Math.cos(fa) * fl * 0.75);
            ctx.strokeStyle = "rgba(255,255,255,0.88)";
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
          ctx.restore();
        }

        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const W = canvas.parentElement?.offsetWidth || window.innerWidth;
      const H = canvas.parentElement?.offsetHeight || window.innerHeight;
      start(W, H);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

// ── Fingerprint circles (Iveta's visual motif) ───────────────────────────────
function Fingerprints({ size = 320 }: { size?: number }) {
  const circles = [
    { cx: "38%", cy: "42%", r: "38%", color: C.gold, op: 0.18 },
    { cx: "55%", cy: "35%", r: "34%", color: "#8B6FA0", op: 0.13 },
    { cx: "48%", cy: "58%", r: "32%", color: "#6B9E8A", op: 0.13 },
    { cx: "65%", cy: "52%", r: "30%", color: "#C47A5A", op: 0.12 },
    { cx: "28%", cy: "60%", r: "28%", color: "#5A7AC4", op: 0.10 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r}
          fill="none" stroke={c.color} strokeWidth="0.8" opacity={c.op * 6}
          style={{ filter: "blur(0.3px)" }}
        />
      ))}
      {circles.map((c, i) => (
        <g key={`rings-${i}`}>
          {[1,2,3].map(j => (
            <circle key={j} cx={c.cx} cy={c.cy}
              r={`${parseFloat(c.r) * (0.6 + j * 0.14)}%`}
              fill="none" stroke={c.color} strokeWidth="0.4" opacity={c.op * 3}
            />
          ))}
        </g>
      ))}
      {circles.map((c, i) => (
        <circle key={`fill-${i}`} cx={c.cx} cy={c.cy} r={`${parseFloat(c.r) * 0.25}%`}
          fill={c.color} opacity={c.op * 2.5}
        />
      ))}
    </svg>
  );
}

// ── Gold divider ──────────────────────────────────────────────────────────────
function Divider({ width = 48 }: { width?: number }) {
  return <div style={{ width, height: 2, background: C.gold, borderRadius: 1, margin: "0 0 28px" }} />;
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 3, height: 18, background: C.gold, borderRadius: 2 }} />
      <span style={{ fontSize: 11, letterSpacing: "0.2em", color: C.gold, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold" }}>
        {children}
      </span>
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
function Btn({ children, primary = true, onClick, small = false }: { children: React.ReactNode; primary?: boolean; onClick?: () => void; small?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: small ? "9px 22px" : "13px 30px",
        background: primary ? (hover ? C.goldLight : C.gold) : "transparent",
        border: primary ? "none" : `1px solid ${hover ? C.gold : C.sand}`,
        borderRadius: 32,
        color: primary ? C.dark : (hover ? C.gold : C.muted),
        fontSize: small ? 12 : 13,
        fontFamily: "Trebuchet MS, sans-serif",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >{children}</button>
  );
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const scrollY = useScrollY();
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width < 1024;
  const [activeSection, setActiveSection] = useState("O mně");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [playingPodcast, setPlayingPodcast] = useState<string | null>(null);
  const reserveBtnRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    const map: Record<string, string> = { "o mně": "o-mne", "konzultace": "konzultace", "supervize": "supervize", "výcvik": "vycvik", "videa": "videa", "podcast": "podcast", "kontakt": "kontakt" };
    const el = document.getElementById(map[id.toLowerCase()] || id.toLowerCase().replace(/\s/g, "-").replace(/[^\w-]/g, ""));
    el?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navScrolled = scrollY > 60;
  const px = isMobile ? "24px" : isTablet ? "40px" : "80px";

  return (
    <div style={{ fontFamily: "Georgia, serif", background: C.cream, color: C.text, overflowX: "hidden" }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navScrolled || menuOpen ? "rgba(250,248,244,0.98)" : "transparent",
        backdropFilter: navScrolled || menuOpen ? "blur(12px)" : "none",
        borderBottom: navScrolled || menuOpen ? `1px solid ${C.sand}` : "none",
        transition: "all 0.3s",
        padding: `0 ${px}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: navScrolled ? 58 : 68,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div style={{ width: 3, height: 24, background: C.gold, borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: isMobile ? 14 : 15, color: navScrolled || menuOpen ? C.dark : C.white, letterSpacing: "0.03em", transition: "color 0.3s" }}>Iveta Clarke</div>
            {!isMobile && <div style={{ fontSize: 8, color: C.gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif" }}>INSPIRING CONVERSATION</div>}
          </div>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: "flex", gap: isTablet ? 18 : 28, alignItems: "center" }}>
            {navItems.map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(/\s/g, "-"))}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, fontFamily: "Trebuchet MS, sans-serif",
                  color: navScrolled ? C.muted : "rgba(255,255,255,0.8)",
                  transition: "color 0.2s", padding: "4px 0",
                }}
                onMouseEnter={e => e.currentTarget.style.color = C.gold}
                onMouseLeave={e => e.currentTarget.style.color = navScrolled ? C.muted : "rgba(255,255,255,0.8)"}
              >{item}</button>
            ))}
            <Btn small onClick={() => scrollTo("konzultace")}>Rezervovat</Btn>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 8,
            display: "flex", flexDirection: "column", gap: 5,
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 24, height: 2, borderRadius: 2,
                background: navScrolled || menuOpen ? C.dark : C.white,
                transition: "all 0.3s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                  : i === 2 ? "rotate(-45deg) translate(5px, -5px)"
                  : "scaleX(0)"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {isMobile && menuOpen && (
        <div style={{
          position: "fixed", top: 58, left: 0, right: 0, zIndex: 99,
          background: "rgba(250,248,244,0.98)", backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.sand}`,
          padding: "16px 24px 24px",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {navItems.map(item => (
            <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(/\s/g, "-"))}
              style={{
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                fontSize: 17, fontFamily: "Georgia, serif", color: C.dark,
                padding: "12px 0", borderBottom: `1px solid ${C.sand}`,
              }}
            >{item}</button>
          ))}
          <div style={{ paddingTop: 16 }}>
            <Btn onClick={() => scrollTo("konzultace")}>Rezervovat konzultaci</Btn>
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center",
        background: `linear-gradient(160deg, ${C.darker} 0%, #3A2C4E 50%, ${C.dark} 100%)`,
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", opacity: 0.65 }}>
          <DandelionCanvas targetRef={reserveBtnRef} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)` }} />

        <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "100px 24px 72px" : `120px ${px} 80px`, maxWidth: isMobile ? "100%" : 700 }}>
          <div style={{ fontSize: isMobile ? 10 : 11, letterSpacing: "0.3em", color: C.gold, fontFamily: "Trebuchet MS, sans-serif", marginBottom: 20, opacity: 0, animation: "fadeUp 0.8s ease 0.2s forwards" }}>
            {heroData.tagline}
          </div>
          <h1 style={{ fontSize: isMobile ? "clamp(36px, 10vw, 52px)" : "clamp(42px, 6vw, 72px)", color: C.white, fontWeight: "normal", lineHeight: 1.1, margin: "0 0 8px", opacity: 0, animation: "fadeUp 0.8s ease 0.4s forwards" }}>
            {heroData.title1}
          </h1>
          <h1 style={{ fontSize: isMobile ? "clamp(36px, 10vw, 52px)" : "clamp(42px, 6vw, 72px)", color: C.gold, fontWeight: "normal", lineHeight: 1.1, margin: "0 0 28px", fontStyle: "italic", opacity: 0, animation: "fadeUp 0.8s ease 0.55s forwards" }}>
            {heroData.title2}
          </h1>
          <p style={{ fontSize: isMobile ? 16 : 18, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, maxWidth: 520, margin: "0 0 14px", opacity: 0, animation: "fadeUp 0.8s ease 0.7s forwards" }}>
            {heroData.subtitle}
          </p>
          <p style={{ fontSize: isMobile ? 14 : 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, fontStyle: "italic", maxWidth: 480, margin: "0 0 40px", opacity: 0, animation: "fadeUp 0.8s ease 0.78s forwards" }}>
            {heroData.mission}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.8s ease 0.85s forwards" }}>
            <div ref={reserveBtnRef} style={{ display: "inline-block" }}>
              <Btn onClick={() => scrollTo("konzultace")}>Rezervovat konzultaci</Btn>
            </div>
            <Btn primary={false} onClick={() => scrollTo("videa")}>Prozkoumat videa →</Btn>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0, animation: "fadeUp 0.8s ease 1.2s forwards" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", fontFamily: "Trebuchet MS" }}>SCROLLOVAT</div>
          <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)` }} />
        </div>
      </section>

      {/* ── QUOTE ────────────────────────────────────────────────────────── */}
      <section style={{ background: C.dark, padding: isMobile ? "44px 24px" : "60px 40px", textAlign: "center" }}>
        <Reveal>
          <div style={{ width: 40, height: 1, background: C.gold, margin: "0 auto 24px" }} />
          <blockquote style={{
            fontSize: "clamp(16px, 2.2vw, 22px)", color: "rgba(255,255,255,0.82)",
            fontStyle: "italic", maxWidth: 640, margin: "0 auto",
            lineHeight: 1.75, letterSpacing: "0.01em",
          }}>
            „Možná nedostanete vždycky přesně to, co chcete.<br />
            Ale vždycky si odnesete to, co potřebujete."
          </blockquote>
          <div style={{ width: 40, height: 1, background: C.gold, margin: "24px auto 0" }} />
        </Reveal>
      </section>

      {/* ── O MNĚ ────────────────────────────────────────────────────────── */}
      <section id="o-mne" style={{ padding: isMobile ? "64px 24px" : `80px ${px}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 80, alignItems: "center" }}>
          <Reveal>
            <SectionLabel>O MNĚ</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: "normal", margin: "0 0 8px", lineHeight: 1.2 }}>
              Jsem profesionální<br />kouč, mentor a supervizor
            </h2>
            <Divider />
            <p style={{ fontSize: 15.5, color: C.muted, lineHeight: 1.9, marginBottom: 20 }}>
              {aboutData.shortBio}
            </p>
            {aboutData.longBio.slice(0, 2).map((p, i) => (
              <p key={i} style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.9, marginBottom: 16 }}>{p}</p>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 32 }}>
              {aboutData.stats.map(([num, label]) => (
                <div key={label} style={{ textAlign: "center", padding: "20px 12px", background: C.warm, borderRadius: 12, border: `1px solid ${C.sand}` }}>
                  <div style={{ fontSize: 28, color: C.gold, marginBottom: 4 }}>{num}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif" }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ position: "relative" }}>
              {/* Photo */}
              <div style={{
                width: "100%", aspectRatio: "3/4", borderRadius: 20,
                overflow: "hidden", position: "relative",
                border: `1px solid ${C.sand}`,
                boxShadow: "0 8px 40px rgba(44,44,62,0.12)",
              }}>
                <img
                  src="/iveta-photo.png"
                  alt="Iveta Clarke"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: C.gold }} />
              </div>
              {/* Fingerprint motif */}
              <div style={{ position: "absolute", top: -40, right: -40, opacity: 0.5, pointerEvents: "none" }}>
                <Fingerprints size={200} />
              </div>
            </div>
          </Reveal>
        </div>
        </div>
      </section>

      {/* ── KONZULTACE ───────────────────────────────────────────────────── */}
      <section id="konzultace" style={{ background: C.warm, padding: isMobile ? "64px 24px" : `80px ${px}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>KONZULTACE & MENTORING</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px" }}>Jak mohu pomoci</h2>
            <Divider />
          </Reveal>

          {/* Individual consultations */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, marginBottom: 32 }}>
            {consultationData.individual.map((item, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <div style={{
                  background: C.white, borderRadius: 20, padding: "28px 32px",
                  border: `1px solid ${C.sand}`,
                  boxShadow: "0 4px 32px rgba(44,44,62,0.06)",
                  display: "flex", flexDirection: "column", height: "100%",
                }}>
                  <div style={{ width: 4, height: 3, background: C.gold, borderRadius: 2, marginBottom: 16 }} />
                  <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.2em", fontFamily: "Trebuchet MS", marginBottom: 8 }}>{item.duration.toUpperCase()}</div>
                  <h3 style={{ fontSize: 18, fontWeight: "normal", margin: "0 0 12px" }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: "0 0 24px", flex: 1 }}>{item.desc}</p>
                  <div style={{ borderTop: `1px solid ${C.sand}`, paddingTop: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 24, color: C.dark }}>{item.price}</div>
                      <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS", marginTop: 4 }}>{item.priceNote}</div>
                    </div>
                    <Btn small onClick={() => alert("→ Přesměrování na kalendář rezervací")}>Rezervovat</Btn>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Packages */}
          <Reveal delay={0.15}>
            <h3 style={{ fontSize: 18, fontWeight: "normal", color: C.dark, margin: "0 0 20px" }}>Možnosti spolupráce</h3>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)", gap: 20 }}>
            {consultationData.packages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={0.1 + i * 0.1}>
                <div style={{
                  background: C.white, borderRadius: 16, padding: "28px 24px",
                  border: `1px solid ${C.sand}`,
                  boxShadow: "0 4px 24px rgba(44,44,62,0.05)",
                  position: "relative", overflow: "hidden",
                  display: "flex", flexDirection: "column", height: "100%",
                }}>
                  <div style={{ width: 3, height: "100%", position: "absolute", left: 0, top: 0, background: C.gold }} />
                  <div style={{ paddingLeft: 4, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS", letterSpacing: "0.15em", marginBottom: 6 }}>{pkg.duration.toUpperCase()}</div>
                    <div style={{ fontSize: 17, color: C.dark, marginBottom: 12, lineHeight: 1.3 }}>{pkg.title}</div>
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, marginBottom: 20, flex: 1 }}>{pkg.desc}</p>
                    <div style={{ fontSize: 22, color: C.dark, marginBottom: 4 }}>{pkg.price}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS", marginBottom: 16 }}>{pkg.priceNote}</div>
                    <Btn small onClick={() => alert("→ Rezervace balíčku")}>Vybrat balíček</Btn>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Note */}
          <Reveal delay={0.3}>
            <div style={{ marginTop: 28, padding: "16px 22px", background: C.cream, borderRadius: 10, border: `1px solid ${C.sand}` }}>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                {consultationData.note}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SUPERVIZE ────────────────────────────────────────────────────── */}
      <section id="supervize" style={{ padding: isMobile ? "64px 24px" : `80px ${px}`, background: C.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>PRO KOUČE</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px" }}>Supervize</h2>
            <Divider />
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 60 }}>
            <Reveal>
              <h3 style={{ fontSize: 20, fontWeight: "normal", margin: "0 0 16px" }}>Co je supervize?</h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>{supervisionData.intro}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {supervisionData.functions.map(f => (
                  <div key={f.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(201,168,76,0.1)", border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.gold, flexShrink: 0, fontFamily: "Trebuchet MS", fontWeight: "bold" }}>
                      {f.label[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: "bold", color: C.dark, fontFamily: "Trebuchet MS", marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 style={{ fontSize: 20, fontWeight: "normal", margin: "0 0 16px" }}>Moje kvalifikace</h3>
              <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.9, marginBottom: 28 }}>{supervisionData.qualification}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {supervisionData.packages.map(pkg => (
                  <div key={pkg.title} style={{ background: C.white, borderRadius: 14, padding: "20px 22px", border: `1px solid ${C.sand}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 15, color: C.dark, marginBottom: 4 }}>{pkg.title}</div>
                      <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS" }}>{pkg.sessions} · {pkg.duration}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, color: C.dark }}>{pkg.price}</div>
                      <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS", marginTop: 4, marginBottom: 8 }}>{pkg.priceNote}</div>
                      <Btn small onClick={() => alert("→ Rezervovat supervizi")}>Rezervovat</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── VÝCVIK ───────────────────────────────────────────────────────── */}
      <section id="vycvik" style={{ padding: isMobile ? "64px 24px" : `80px ${px}`, background: C.warm }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>PRO KOUČE</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px" }}>Výcvik</h2>
            <Divider />
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ background: C.dark, borderRadius: 24, overflow: "hidden" }}>
              <div style={{ height: 4, background: `linear-gradient(to right, ${C.gold}, #E8C96A)` }} />
              <div style={{ padding: "40px 44px" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 48, alignItems: "start" }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS", marginBottom: 12 }}>WORKSHOP PRO PROFESIONÁLNÍ KOUČE</div>
                    <h3 style={{ fontSize: 26, color: C.white, fontWeight: "normal", margin: "0 0 6px" }}>{supervisionData.workshop.title}</h3>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "Trebuchet MS", marginBottom: 20 }}>{supervisionData.workshop.subtitle}</div>
                    <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 20 }}>{supervisionData.workshop.desc}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[supervisionData.workshop.date, supervisionData.workshop.earlyBird, supervisionData.workshop.maxParticipants].map(info => (
                        <div key={info} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: "Trebuchet MS" }}>{info}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Trebuchet MS", letterSpacing: "0.15em", marginBottom: 16 }}>VARIANTY ÚČASTI</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {/* Základní program */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "rgba(201,168,76,0.12)", borderRadius: 10, border: `1px solid rgba(201,168,76,0.3)` }}>
                        <span style={{ fontSize: 13, color: C.white, fontWeight: "bold" }}>{supervisionData.workshop.base.label}</span>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 16, color: C.gold, fontWeight: "bold", fontFamily: "Trebuchet MS" }}>{supervisionData.workshop.base.price}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "Trebuchet MS", marginTop: 4 }}>{supervisionData.workshop.base.priceNote}</div>
                        </div>
                      </div>
                      {/* Nástavby */}
                      <div style={{ paddingLeft: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "Trebuchet MS", letterSpacing: "0.12em", marginBottom: 2 }}>+ VOLITELNÝ BONUS</div>
                        {supervisionData.workshop.bonuses.map(b => (
                          <div key={b.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)" }}>{b.label}</span>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 15, color: C.gold, fontFamily: "Trebuchet MS", fontWeight: "bold" }}>{b.price}</div>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "Trebuchet MS", marginTop: 4 }}>{b.priceNote}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Plný program */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "rgba(255,255,255,0.08)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", marginTop: 2 }}>
                        <div>
                          <span style={{ fontSize: 13, color: C.white }}>{supervisionData.workshop.full.label}</span>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "Trebuchet MS", marginTop: 2 }}>Základní program + oba bonusy</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 16, color: C.gold, fontWeight: "bold", fontFamily: "Trebuchet MS" }}>{supervisionData.workshop.full.price}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "Trebuchet MS", marginTop: 4 }}>{supervisionData.workshop.full.priceNote}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 24 }}>
                      <Btn onClick={() => alert("→ Přihláška na workshop")}>Mám zájem o účast</Btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── VIDEA ────────────────────────────────────────────────────────── */}
      <section id="videa" style={{ padding: isMobile ? "64px 24px" : `80px ${px}`, background: C.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>INSPIRATIVNÍ VIDEA</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px" }}>Série krátkých přednášek</h2>
            <Divider />
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, maxWidth: 560, marginBottom: 48 }}>
              Mini přednášky o tématech, která hýbají našimi životy. První video každé série zdarma.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
            {videoSeries.map((series, i) => (
              <Reveal key={series.title} delay={i * 0.1}>
                <div style={{
                  background: C.white, borderRadius: 16, overflow: "hidden",
                  border: `1px solid ${C.sand}`,
                  boxShadow: "0 4px 24px rgba(44,44,62,0.05)",
                }}>
                  {/* Video thumbnail placeholder */}
                  <div style={{
                    background: `linear-gradient(135deg, ${C.dark}, #3A2C4E)`,
                    height: 160, display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                  }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Trebuchet MS", letterSpacing: "0.2em" }}>VIDEO ZNĚLKA</div>
                    <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.dark }}>▶</div>
                    </div>
                    <div style={{ position: "absolute", top: 10, left: 12, fontSize: 9, color: C.gold, fontFamily: "Trebuchet MS", letterSpacing: "0.15em" }}>
                      {series.free === 1 ? "1. EPIZODA ZDARMA" : ""}
                    </div>
                  </div>
                  <div style={{ padding: "20px 22px" }}>
                    <div style={{ fontSize: 15, color: C.dark, marginBottom: 8, lineHeight: 1.4 }}>{series.title}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS", marginBottom: 16 }}>{series.episodes} epizod · max 7 min každá</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <Btn small onClick={() => alert("→ Přehrát první epizodu zdarma")}>Přehrát zdarma</Btn>
                      <Btn small primary={false} onClick={() => alert("→ Zakoupit celou sérii")}>Celá série</Btn>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PODCAST ──────────────────────────────────────────────────────── */}
      <section id="podcast" style={{ background: C.dark, padding: isMobile ? "64px 24px" : `80px ${px}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>PODCAST</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px", color: C.white }}>Autorské epizody</h2>
            <Divider />
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
            {podcasts.map((pod, i) => (
              <Reveal key={pod.name} delay={i * 0.15}>
                <div style={{
                  background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "32px 28px",
                  border: `1px solid rgba(255,255,255,0.08)`,
                  backdropFilter: "blur(8px)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS", letterSpacing: "0.15em", marginBottom: 6 }}>{pod.type.toUpperCase()}</div>
                      <h3 style={{ fontSize: 22, color: C.white, fontWeight: "normal", margin: 0 }}>{pod.name}</h3>
                    </div>
                    {pod.free ? (
                      <div style={{ fontSize: 9, background: "rgba(74,124,90,0.3)", color: "#7AC48A", padding: "4px 12px", borderRadius: 12, fontFamily: "Trebuchet MS", border: "1px solid rgba(74,124,90,0.4)" }}>ZDARMA</div>
                    ) : (
                      <div style={{ fontSize: 9, background: "rgba(201,168,76,0.2)", color: C.gold, padding: "4px 12px", borderRadius: 12, fontFamily: "Trebuchet MS", border: `1px solid rgba(201,168,76,0.3)` }}>BRZY</div>
                    )}
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 20 }}>{pod.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "Trebuchet MS" }}>{pod.episodes}</div>
                    {pod.free && (
                      <button
                        onClick={() => setPlayingPodcast(playingPodcast === pod.name ? null : pod.name)}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          background: "transparent", border: `1px solid ${C.gold}`,
                          borderRadius: 24, padding: "8px 18px",
                          color: C.gold, fontSize: 12, fontFamily: "Trebuchet MS", cursor: "pointer",
                        }}
                      >
                        {playingPodcast === pod.name ? "⏸ Pauza" : "▶ Poslouchat"}
                      </button>
                    )}
                  </div>
                  {playingPodcast === pod.name && (
                    <div style={{ marginTop: 16, background: "rgba(201,168,76,0.1)", borderRadius: 10, padding: "12px 16px" }}>
                      <div style={{ fontSize: 10, color: C.gold, fontFamily: "Trebuchet MS", marginBottom: 8 }}>PŘEHRÁVÁ SE</div>
                      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 4 }}>
                        <div style={{ background: C.gold, height: "100%", width: "35%", borderRadius: 4 }} />
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div style={{ marginTop: 32, padding: "20px 24px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Poslouchejte také na platformách</div>
              <div style={{ display: "flex", gap: 12 }}>
                {["Spotify", "Apple Podcasts", "Google Podcasts"].map(p => (
                  <div key={p} style={{ padding: "7px 16px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "Trebuchet MS", cursor: "pointer" }}>{p}</div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── KONTAKT ──────────────────────────────────────────────────────── */}
      <section id="kontakt" style={{ padding: isMobile ? "64px 24px" : `80px ${px}`, background: C.cream }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>KONTAKT</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px" }}>Napište mi</h2>
            <Divider />
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 40 }}>
              Ráda se dozvím více o vás a vašich potřebách před prvním sezením.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            {contactSent ? (
              <div style={{ background: C.dark, borderRadius: 20, padding: "56px 40px", textAlign: "center", border: `1px solid rgba(201,168,76,0.3)` }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <div style={{ fontSize: 22, color: C.gold, marginBottom: 12 }}>Zpráva odeslána</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "Trebuchet MS" }}>Ozvu se vám do 2 pracovních dnů</div>
              </div>
            ) : (
              <div style={{ background: C.white, borderRadius: 20, padding: "40px", border: `1px solid ${C.sand}`, boxShadow: "0 4px 32px rgba(44,44,62,0.06)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    { key: "name", label: "JMÉNO A PŘÍJMENÍ", placeholder: "Jana Nováková", type: "text" },
                    { key: "email", label: "E-MAIL", placeholder: "jana@example.com", type: "email" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 10, letterSpacing: "0.15em", color: C.muted, fontFamily: "Trebuchet MS", display: "block", marginBottom: 8 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        style={{
                          width: "100%", padding: "13px 16px", borderRadius: 10,
                          border: `1px solid ${C.sand}`, background: C.cream,
                          fontSize: 14, fontFamily: "Georgia, serif", color: C.text, outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: "0.15em", color: C.muted, fontFamily: "Trebuchet MS", display: "block", marginBottom: 8 }}>VAŠE ZPRÁVA</label>
                    <textarea placeholder="Napište, s čím bych vám mohla pomoci..." rows={5}
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{
                        width: "100%", padding: "13px 16px", borderRadius: 10,
                        border: `1px solid ${C.sand}`, background: C.cream,
                        fontSize: 14, fontFamily: "Georgia, serif", color: C.text, outline: "none",
                        resize: "vertical", boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <Btn onClick={() => setContactSent(true)}>Odeslat zprávu</Btn>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: C.darker, padding: isMobile ? "40px 24px" : `48px ${px}`, borderTop: `3px solid ${C.gold}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 3, height: 22, background: C.gold, borderRadius: 2 }} />
              <div style={{ fontSize: 16, color: C.white }}>Iveta Clarke</div>
            </div>
            <div style={{ fontSize: 9, color: C.gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS" }}>INSPIRING CONVERSATION</div>
          </div>

          {!isMobile && (
            <div style={{ display: "flex", gap: 32 }}>
              {navItems.map(item => (
                <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(/\s/g, "-"))}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "Trebuchet MS", color: "rgba(255,255,255,0.35)" }}
                  onMouseEnter={e => e.currentTarget.style.color = C.gold}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                >{item}</button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            {["Facebook", "LinkedIn", "Instagram"].map(s => (
              <div key={s} style={{
                padding: "8px 16px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20,
                fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Trebuchet MS", cursor: "pointer",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
              >{s}</div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "24px auto 0", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "Trebuchet MS" }}>© 2025 Iveta Clarke · ivetaclarke.com</div>
        </div>
      </footer>

      {/* ── CSS animations ───────────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        button { font-family: inherit; -webkit-tap-highlight-color: transparent; }
        input:focus, textarea:focus { border-color: #C9A84C !important; }
        html { scroll-behavior: smooth; }
        @media (max-width: 767px) {
          br { display: none; }
        }
      `}</style>
    </div>
  );
}
