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
  shortBio: "Jsem certifikovaný kouč, mentor a supervizor s mezinárodní praxí a více než 25 lety zkušeností v oboru dialogické práce s lidmi. Pracuji s inteligentními a zralými lidmi, kteří více než dosažení cíle potřebují novou navigaci.  Ve společném dialogu hledáme nové podněty, zdroje, směr, energii nebo impuls.",
  longBio: [
    "Ve své práci používám principy a kompetence profesionálního koučování, aplikuji supervizní a reflektivní techniky a modely, vycházím z teorie chování systémů, přináším moderní nástroje navigace v životních přechodech a sdílím vlastní zkušenosti a příběhy.",
    "Aktivně se vzdělávám nejen ve svém oboru, ale i v oborech, které pomáhají mě i mým klientům rozšiřovat kapacitu našeho vědomí - studuji ezoterickou filosofii, kvantovou fyziku, lidské dějiny a aspekty moderní spirituality.  Zabývám se intenzivně studiem lidské moudrosti a možnostmi její kultivace.",
    "Všechno, co umím, co studuji a co vím o životě, utváří, kým jsem a kým se postupně stávám.",
    "A to vše je k dispozici lidem, s kterými pracuji.",
  ],
  stats: [["25+", "let zkušeností"], ["500+", "klientů"], ["3", "specializace"]],
};

const consultationData = {
  intro: [
    "Věřím, že aby člověk mohl lépe přemýšlet, potřebuje s někým mluvit.",
    "Jsem kvalifikovaným průvodcem lidem v labyrintu přechodových životních fází (Life Transitions) – specificky v období midlife, nebo v období významných životních zlomů (Life-Quakes).",
    "Častými průvodními jevy nebo spouštěči těchto tranzicí jsou nejistota, ztráta smyslu a směru, absence plánu nebo vize, potřeba obnovy, nové role, náročné emoce, kolapsy dlouholetých vztahů, únava oborem, kariérní strop a kariérní exit, nebo rodinná generační komplexita.",
    "Pro své klienty jsem současně podporovatelem a vyzyvatelem.",
  ],
  note: "Setkání mohou být online anebo osobní, v mé kanceláři v centru Prahy. Plánujete si je sami v požadované frekvenci, dle mého plánovacího kalendáře, který budete mít po celou dobu spolupráce k dispozici. Ceny zahrnují 21 % DPH. Balíčky jsou platné ode dne převodu platby na účet ReDefine s.r.o",
  packages: [
    {
      id: "1x",
      title: "Jednorázová konzultace",
      tagline: "Vyzkoušejte sílu rozhovoru s kvalifikovaným mentorem.",
      cardDesc: "Tento formát je vhodný pro lidi, kteří se potřebují především rychle zorientovat ve vlastní situaci. Čekejte zasazení do širšího kontextu, pojmenování základních otázek, definování vašich témat, a ošetření emocí.",
      modalDesc: "Jednorázovou konzultací získáte osobní zkušenost a pochopíte přidanou hodnotu práce s mentorem.",
      result: "Výsledkem je vhled do situace, nasměrování a zklidnění.",
      format: "Online · 60 minut",
      price: "5 990 Kč",
      priceNote: "vč. DPH / 4 950 Kč bez DPH",
    },
    {
      id: "1x-personal",
      title: "Konzultace osobní",
      tagline: "Hloubkový rozhovor s přesahem, tváří v tvář.",
      cardDesc: "Osobní setkání v mé kanceláři v centru Prahy. Prostor pro reflexi, zasazení do širšího kontextu a konkrétní impulzy pro váš život. Intenzivnější formát vhodný pro klíčová životní rozhodnutí.",
      modalDesc: "Osobní setkání vytváří hlubší prostor pro kontakt a reflexi. Přijďte, jak jste – a odejdete s novým vhledem.",
      result: "Výsledkem je vhled do situace, nasměrování a zklidnění.",
      format: "Osobně · Praha · 90 minut",
      price: "8 990 Kč",
      priceNote: "vč. DPH / 7 430 Kč bez DPH",
    },
    {
      id: "3m",
      title: "Krátkodobá spolupráce",
      tagline: "Pro zvídavé nováčky v osobní práci.",
      cardDesc: "Tento formát je vhodný pro lidi, kteří se potřebují zklidnit, a efektivně vyhodnotit svoje další kroky a směr. Prozkoumání vašich současných dilemat, vyhodnocení vašich postojů a osvojení několika konceptů umožní vidět vaši situaci na přehlednější mapě.",
      modalDesc: "S tímto balíčkem máte k dispozici neomezený počet setkání dle vaší potřeby, každé v délce 90 minut, po dobu 3 měsíců.",
      result: "Výsledkem je lepší orientace ve vašem terénu.",
      format: "Neomezený počet setkání · 90 min / setkání · 3 měsíce",
      price: "24 990 Kč",
      priceNote: "vč. DPH / 20 653 Kč bez DPH",
    },
    {
      id: "6m",
      title: "Střednědobá spolupráce",
      tagline: "Pro lidi, kteří chtějí udržitelné usazení (grounding).",
      cardDesc: "Tento formát umožňuje jít do větší hloubky, k podstatě dilemat a otázek, které si kladete. Ověřené koncepty a nástroje mohou pomoci v rozšíření vaší perspektivy a zprostředkují nové vhledy.",
      modalDesc: "S tímto balíčkem máte k dispozici neomezený počet setkání dle vaší potřeby, každé v délce 90 minut, po dobu 6 měsíců.",
      result: "Výsledkem je udržitelné zklidnění, úleva, obnova energie a akceschopnosti.",
      format: "Neomezený počet setkání · 90 min / setkání · 6 měsíců",
      price: "44 990 Kč",
      priceNote: "vč. DPH / 37 182 Kč bez DPH",
    },
    {
      id: "12m",
      title: "Roční spolupráce",
      tagline: "Pro lidi, kteří hledají udržitelný životní posun.",
      cardDesc: "Dlouhodobé osobní provázení vaším životním kontextem a profesionální mentoring zahrnující informace, zkušenosti a nové mentální koncepty k osvojení. Budujeme vztah. Máme čas na nácvik a osvojení nových návyků a postojů.",
      modalDesc: "Máte k dispozici neomezený počet setkání, každé v délce 90 minut, po dobu jednoho ročního cyklu.",
      result: "Jsem vaším důvěrným partnerem, průvodcem, podporovatelem, rádcem a vyzyvatelem.",
      format: "Neomezený počet setkání · 90 min / setkání · 12 měsíců",
      price: "74 990 Kč",
      priceNote: "vč. DPH / 61 975 Kč bez DPH",
    },
  ],
};

const youtubeVideos = [
  { id: "uyxU4th8LEI", title: "The Midlife Passage ft. Iveta Clarke" },
  { id: "bpg5dfhYkYU", title: "Životní koučka: Krize středního věku není váš konec" },
  { id: "Qu2mKbF3zDw", title: "Iveta Clarke | Nevzdávejte to" },
  { id: "0Gq_aJLfjPs", title: "Podcast Evolucionáři: Iveta Clarke" },
  { id: "kNZncv6sAiM", title: "Stýská se mi po krásných staromódních slovech" },
];

const videoSeries = [
  { title: "Midlife – kompetence a postoje k životu ve středním věku", episodes: 6, free: 1 },
  { title: "Kultivace moudrosti", episodes: 6, free: 1 },
  { title: "Stud a zranitelnost", episodes: 6, free: 1 },
  { title: "Jak mluvit s lidmi (aby vás poslouchali)", episodes: 6, free: 1 },
];

const episodes = [
  { id: "5UOTFpRcoCr12Dg0mEgxAO", title: "O prostoru", type: "Zámyslník" },
  { id: "4cjorrCTJGRyJlT1lmFNaG", title: "Quo Vadis muži?", type: "Epizoda s hosty" },
  { id: "1vL2y8ceBSq2VjnFvHMXWH", title: "Rady od protinožce", type: "Zámyslník" },
  { id: "6M7NwThiTCbSeDhRrc63ll", title: "Zrání mužů v Čechách", type: "Zámyslník" },
  { id: "2s5AiSTTa5FnZVvZSmNhLE", title: "Láska a úcta III", type: "Zámyslník" },
  { id: "1IM2wmBq6ohfZ3JiasdjBc", title: "Láska a úcta II", type: "Zámyslník" },
  { id: "3UtPggQJvQ5tmXxbTQ28yR", title: "Porovnejme své matky", type: "Zámyslník" },
  { id: "1ymZDgA21ekMu92z45Tzns", title: "Operace mého srdce", type: "Zámyslník" },
  { id: "4L2dQmwuM3sqRzWKAB8ROL", title: "O zoomové intimitě", type: "Zámyslník" },
  { id: "3UmWXe8NlsFsU4tHY3Zd0P", title: "Rozprostřenost Pavla Rataje", type: "Epizoda s hosty" },
];

const podcasts = [
  {
    name: "Každopádně Kladně - Zámyslník 1.0",
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
  introSub: "Má tři základní funkce:",
  functions: [
    { label: "Normativní (kontrolní)", desc: "Zaměřuje se na kvalitu a standardy práce. „Dělám svou práci správně?“" },
    { label: "Formativní (rozvojová)", desc: "Zaměřuje se na učení a profesní růst. „Jak se můžu zlepšit?“" },
    { label: "Restorativní (podpůrná)", desc: "Zaměřuje se na psychickou pohodu a zvládání zátěže. „Jak u toho vydržím v rovnováze?“" },
  ],
  qualification: "Supervizní práce je pro mě způsob, jak mohu neustále zvyšovat úroveň a profesionalitu oboru, ve kterém působím téměř čtvrt století. Proto jsem prošla odborným supervizním výcvikem (CSA London) a mezinárodním akreditačním procesem u profesní organizace EMCC (level ESIA Senior Practitioner).",
  qualificationSub: "ESIA (European Supervision Individual Accreditation) ověřuje reálnou praxi v supervizi, schopnost reflektovat vlastní práci, dodržování etiky profese a kontinuální profesní rozvoj.",
  packages: [
    {
      id: "sup-1x",
      title: "Ochutnávka supervize",
      tagline: "Osobní zkušenost s hodnotou reflektivní práce.",
      cardDesc: "Jednorázovou konzultací získáte osobní zkušenost, pochopíte přidanou hodnotu reflektivní práce a zároveň ověříme vzájemnou kompatibilitu.",
      modalDesc: "Jednorázové online setkání v rozsahu 45 minut.",
      result: "",
      format: "Online · jednorázové setkání · 45 minut",
      price: "4 890 Kč",
      priceNote: "vč. DPH / 4 041 Kč bez DPH",
    },
    {
      id: "sup-6x",
      title: "Supervizní balíček",
      tagline: "Pravidelná reflektivní práce nad vaší koučovací praxí.",
      cardDesc: "Pravidelné reflektivní setkávání nad vašimi myšlenkami ohledně koučování; o vás, o vašich klientech, a o tom jak s nimi vstupujete do interakce.",
      modalDesc: "6 osobních nebo online setkání v rozsahu 60 minut.",
      result: "",
      format: "6 setkání · 60 min / setkání · online nebo osobně",
      price: "35 990 Kč",
      priceNote: "vč. DPH / 29 744 Kč bez DPH",
    },
  ],
  workshop: {
    title: "Průvodcem v midlife®",
    subtitle: "Výcvikový a supervizní workshop pro kouče",
    descParagraphs: [
      "Workshop pro kouče, kteří ve své klientské praxi pracují s lidmi ve zlomovém životním období středního věku.",
      "Lidé v tomto období procházejí významným životním přechodem (midlife), který je charakterizován transformací na mnoha úrovních jejich života. Co přesně se děje a jak tyto jevy ovlivňují naše klienty?",
      "Ve workshopu nabízím, co jsem se naučila v Modern Elder Academy, první školy moudrosti na světě, a co získávám ze zdrojů, ke kterým mám jako MEA alumni přístup. Přidám navíc vše, co vím o midlife z vlastní praxe i ze svého života. Své zkušenosti a znalosti jsem sestavila do přehledných bloků, které poskytnou strukturu pro práci s lidmi v tomto období životní tranzice.",
      "Workshop je určen pro uzavřenou skupinu profesionálních koučů, kteří chtějí lépe porozumět specifické cílové skupině svých klientů a seznámit se s nástroji i koncepty, které nejsou v běžných koučovacích výcvicích dostupné.",
    ],
    learns: [
      { title: "O cílové skupině", items: ["Jaký má tento věk specifika? Čím lidé v tomto období skutečně procházejí?", "Co skutečně potřebují? A co z toho vyplývá pro pozici kouče v rozhovoru?"] },
      { title: "O procesu", items: ["Jak se liší přechodové stádium midlife od ostatních životních tranzicí?", "Jaké spouštěče a signály provázejí toto období? Jak probíhá proces zrání?", "Jaká stádia lze v období midlife očekávat a jak je rozpoznáme?"] },
      { title: "O přístupu a metodice", items: ["V čem tkví úspěšná dialogická práce s lidmi v životním přechodu?", "V čem se může lišit od klasického koučování?"] },
      { title: "O nástrojích", items: ["Jaké klasické koučovací nástroje a přístupy v tomto kontextu selhávají?", "A jaké fungují?"] },
    ],
    day1: { title: "Den 1 – Klient", items: ["Životní přechody a jejich specifika relevantní pro pomáhající profese.", "Midlife mýty a předsudky.", "Potřeby lidí v midlife.", "Midlife kompetence."] },
    day2: { title: "Den 2 – Kouč", items: ["Kompetence kouče pro práci s midlifery.", "Práce s vizí a cíli v midlife.", "Emoce v midlife."] },
    bonuses: [
      { id: "b1", label: "Bonus 1", name: "Kultivace moudrosti", desc: "3 hodinový online workshop o tom, co je lidská moudrost, jak se liší od zkušenosti a jak se dá kultivovat. Nástavba kurzu Průvodcem midlife." },
      { id: "b2", label: "Bonus 2", name: "Midlife coaching supervize", desc: "2 hodiny supervizní práce s tématy midlife. Reflektivní prostor pro kouče jako nástavba kurzu Průvodcem midlife." },
    ],
    note: "Exkluzivita obsahu workshopu je důvodem k tomu, že kurz není akreditován žádnou profesní organizací. Účastníkům vystavím potvrzení o absolvování aktuálního počtu hodin supervizní práce, která je součástí workshopu. Potvrzení lze použít pro re-akreditaci v ICF.",
    preCondition: "Účasti na workshopu předchází individuální rozhovor, ve kterém si ujasníme relevanci obsahu k vaší současné koučovací praxi.",
    date: "Nejbližší termín: 9.–10. 10. 2026",
    earlyBird: "Early bird sleva 15 % do konce července 2026",
    maxParticipants: "Max. 12 účastníků · Prezenční, rezidenční · 2× ročně",
    hours: "Časová dotace: 12 hodin výcviku – 2 dny",
    packages: [
      { id: "ws-full", title: "Plný program včetně obou bonusů", tagline: "Kompletní výcvik: základní program + oba bonusy.", cardDesc: "", modalDesc: "", result: "", format: "Prezenční · 2 dny + workshop 3 h + supervize 2 h", price: "66 990 Kč", priceNote: "vč. DPH / 55 364 Kč bez DPH" },
      { id: "ws-b1", title: "S Bonusem 1 – Kultivace moudrosti", tagline: "Základní program + 3hodinový online workshop o lidské moudrosti.", cardDesc: "", modalDesc: "", result: "", format: "Prezenční · 2 dny + online workshop · 3 hodiny", price: "59 990 Kč", priceNote: "vč. DPH / 49 579 Kč bez DPH" },
      { id: "ws-b2", title: "S Bonusem 2 – Midlife coaching supervize", tagline: "Základní program + 2 hodiny supervizní práce s midlife tématy.", cardDesc: "", modalDesc: "", result: "", format: "Prezenční · 2 dny + supervize · 2 hodiny", price: "50 990 Kč", priceNote: "vč. DPH / 42 141 Kč bez DPH" },
      { id: "ws-base", title: "Základní program (2 dny)", tagline: "Dvoudenní prezenční výcvik – základ práce s midlife klienty.", cardDesc: "", modalDesc: "", result: "", format: "Prezenční · 2 dny · 12 hodin výcviku", price: "43 590 Kč", priceNote: "vč. DPH / 36 025 Kč bez DPH", note: "V ceně je zahrnuto malé občerstvení a nápoje. Doprava, ubytování a stravování nejsou zahrnuty." },
    ],
  },
}

const navItems = ["O mně", "Pro veřejnost", "Pro Kouče", "Pro Bono", "Videa", "Podcast", "Kontakt"];
const proVerejnostItems = ["Konzultace", "Kurzy"];
const proKouceItems = ["Supervize", "Výcvik"];
const seduoCourses = [
  {
    title: "Umění rozhovoru",
    url: "https://www.seduo.cz/umeni-rozhovoru",
    desc: "Online kurz zaměřený na umění dialogu, naslouchání a vedení smysluplných rozhovorů.",
    image: "https://seduocz.educdn.cz/images/111322-iveta-clarke-umeni-rozhovoru-cz.jpg:preview3x",
  },
  {
    title: "Umění Zranitelnosti – Posilovna emoční odvahy",
    url: "https://www.seduo.cz/umeni-zranitelnosti-posilovna-emocni-odvahy",
    desc: "Kurz o zranitelnosti, emoční odvaze a cestě k autentickému životu.",
    image: "https://seduocz.educdn.cz/images/118563-b9cda10b-d9cd-4a33-9f04-246379de4067.jpg:preview3x",
  },
];

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

// ── Dot circles motif (Iveta's visual identity) ──────────────────────────────
function Fingerprints({ size = 280 }: { size?: number }) {
  const S = size;
  const R = S * 0.36;
  const configs = [
    { cx: S * 0.30, cy: S * 0.42, color: "#888888" },
    { cx: S * 0.55, cy: S * 0.38, color: "#B0292A" },
    { cx: S * 0.68, cy: S * 0.60, color: "#D4C44A" },
  ];
  const seededRand = (seed: number) => {
    let s = seed;
    return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
  };
  return (
    <svg width={S} height={S * 0.75} viewBox={`0 0 ${S} ${S * 0.75}`} style={{ overflow: "visible" }}>
      <defs>
        {configs.map((c, i) => (
          <clipPath key={i} id={`clip-${i}`}>
            <circle cx={c.cx} cy={c.cy} r={R} />
          </clipPath>
        ))}
      </defs>
      {configs.map((c, i) => {
        const rand = seededRand(i * 999 + 42);
        const dots: { x: number; y: number }[] = [];
        let attempts = 0;
        while (dots.length < 420 && attempts < 8000) {
          attempts++;
          const angle = rand() * Math.PI * 2;
          const dist = Math.sqrt(rand()) * R * 0.97;
          const x = c.cx + Math.cos(angle) * dist;
          const y = c.cy + Math.sin(angle) * dist;
          const tooClose = dots.some(d => Math.hypot(d.x - x, d.y - y) < 4.2);
          if (!tooClose) dots.push({ x, y });
        }
        return (
          <g key={i} clipPath={`url(#clip-${i})`}>
            {dots.map((d, j) => (
              <circle key={j} cx={d.x} cy={d.y} r={1.9} fill={c.color} opacity={0.82} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ── CountUp ───────────────────────────────────────────────────────────────────
function CountUp({ target, suffix = "", duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setVal(Math.round(ease * target));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
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
function Btn({ children, primary = true, onClick, small = false, pulse = false }: { children: React.ReactNode; primary?: boolean; onClick?: () => void; small?: boolean; pulse?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={pulse ? "btn-pulse" : undefined}
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
        transition: "background 0.2s, color 0.2s, border-color 0.2s",
        whiteSpace: "nowrap",
      }}
    >{children}</button>
  );
}

// ── Workshop Modal ────────────────────────────────────────────────────────────
const EARLY_BIRD_DEADLINE = new Date("2026-08-01");
const EARLY_BIRD_DISCOUNT = 0.15;

function applyEarlyBird(priceStr: string): string {
  const raw = parseInt(priceStr.replace(/\s/g, ""), 10);
  const disc = Math.round(raw * (1 - EARLY_BIRD_DISCOUNT) / 10) * 10;
  return disc.toLocaleString("cs-CZ").replace(/ /g, " ") + " Kč";
}

function ebPriceNote(discountedPrice: string): string {
  const raw = parseInt(discountedPrice.replace(/[\s Kč]/g, ""), 10);
  const bezDph = Math.round(raw / 1.21);
  return `vč. DPH / ${bezDph.toLocaleString("cs-CZ").replace(/ /g, " ")} Kč bez DPH`;
}

function WorkshopModal({ onClose, onPay }: {
  onClose: () => void;
  onPay: (pkg: typeof supervisionData.workshop.packages[0]) => void;
}) {
  const w = supervisionData.workshop;
  const [selected, setSelected] = useState<string | null>(null);
  const isEarlyBird = new Date() < EARLY_BIRD_DEADLINE;
  const daysLeft = Math.ceil((EARLY_BIRD_DEADLINE.getTime() - Date.now()) / 86400000);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const selectedPkg = w.packages.find(p => p.id === selected) ?? null;

  // Build the pkg object sent to checkout — early bird gets discounted price + eb- id
  const checkoutPkg = selectedPkg ? (isEarlyBird ? {
    ...selectedPkg,
    id: selectedPkg.id + "-eb",
    price: applyEarlyBird(selectedPkg.price),
    priceNote: ebPriceNote(applyEarlyBird(selectedPkg.price)),
  } : selectedPkg) : null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 600,
      background: "rgba(18,15,30,0.85)",
      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#1E1D2E", borderRadius: 24, maxWidth: 560, width: "100%",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        position: "relative",
      }}>
        {/* Gold top bar */}
        <div style={{ height: 4, background: `linear-gradient(to right, ${C.gold}, ${C.goldLight})`, borderRadius: "24px 24px 0 0" }} />

        <div style={{ padding: "28px 32px 36px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: C.gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 8 }}>WORKSHOP PRO PROFESIONÁLNÍ KOUČE</div>
              <h3 style={{ fontSize: 22, fontWeight: "normal", color: C.white, margin: "0 0 4px" }}>{w.title}</h3>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "Trebuchet MS, sans-serif" }}>{w.subtitle}</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 22, lineHeight: 1, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s", flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}>×</button>
          </div>

          {/* Early bird banner */}
          {isEarlyBird && (
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: 12, marginBottom: 20,
              background: "linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.08) 100%)",
              border: "1px solid rgba(201,168,76,0.4)",
            }}>
              <div style={{ fontSize: 20 }}>🎁</div>
              <div>
                <div style={{ fontSize: 13, color: C.gold, fontWeight: "bold", fontFamily: "Trebuchet MS, sans-serif" }}>Early bird sleva 15 %</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "Trebuchet MS, sans-serif", marginTop: 2 }}>
                  Platí do 31. 7. 2026 &nbsp;·&nbsp; zbývá {daysLeft} {daysLeft === 1 ? "den" : daysLeft < 5 ? "dny" : "dní"}
                </div>
              </div>
            </div>
          )}

          {/* Logistics chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {[w.date, w.maxParticipants, w.hours].map(info => (
              <div key={info} style={{ padding: "5px 12px", background: "rgba(201,168,76,0.1)", borderRadius: 20, border: "1px solid rgba(201,168,76,0.25)", fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "Trebuchet MS, sans-serif" }}>{info}</div>
            ))}
          </div>

          {/* Package selection */}
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 12 }}>ZVOLTE VARIANTU ÚČASTI</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {w.packages.map(pkg => {
              const active = selected === pkg.id;
              const discPrice = isEarlyBird ? applyEarlyBird(pkg.price) : null;
              return (
                <div key={pkg.id} onClick={() => setSelected(pkg.id)} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 18px", borderRadius: 12, cursor: "pointer",
                  background: active ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${active ? C.gold : "rgba(255,255,255,0.09)"}`,
                  transition: "all 0.18s",
                }}>
                  <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
                    <div style={{ fontSize: 14, color: active ? C.gold : C.white, fontWeight: active ? "bold" : "normal", transition: "color 0.18s", lineHeight: 1.3 }}>{pkg.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Trebuchet MS, sans-serif", marginTop: 3 }}>
                      {discPrice ? ebPriceNote(discPrice) : pkg.priceNote}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                      {discPrice && (
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "line-through", fontFamily: "Trebuchet MS, sans-serif" }}>{pkg.price}</div>
                      )}
                      <div style={{ fontSize: 18, color: discPrice ? "#D94F4F" : C.gold, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold", whiteSpace: "nowrap" }}>
                        {discPrice ?? pkg.price}
                      </div>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: `2px solid ${active ? C.gold : "rgba(255,255,255,0.2)"}`,
                      background: active ? C.gold : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.18s", flexShrink: 0,
                    }}>
                      {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1E1D2E" }} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note */}
          <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: "0 0 6px", fontFamily: "Trebuchet MS, sans-serif" }}>{w.note}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0, fontStyle: "italic", fontFamily: "Trebuchet MS, sans-serif" }}>{w.preCondition}</p>
          </div>

          {/* CTA */}
          <button
            disabled={!checkoutPkg}
            onClick={() => checkoutPkg && onPay(checkoutPkg)}
            style={{
              width: "100%", padding: "15px 24px", borderRadius: 32,
              background: checkoutPkg ? C.gold : "rgba(255,255,255,0.06)",
              border: checkoutPkg ? "none" : "1.5px solid rgba(255,255,255,0.1)",
              color: checkoutPkg ? C.darker : "rgba(255,255,255,0.25)",
              fontSize: 13, fontFamily: "Trebuchet MS, sans-serif",
              fontWeight: "bold", letterSpacing: "0.1em",
              cursor: checkoutPkg ? "pointer" : "not-allowed",
              transition: "all 0.22s",
            }}
          >
            {checkoutPkg ? `ZAPLATIT — ${checkoutPkg.price}` : "NEJPRVE ZVOLTE VARIANTU"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Checkout Modal ────────────────────────────────────────────────────────────
function CheckoutModal({ pkg, onClose, onBack }: {
  pkg: typeof consultationData.packages[0];
  onClose: () => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", street: "", city: "", zip: "", company: "", ico: "" });
  const [payMethod, setPayMethod] = useState<"CARD_CZ" | "APPLEPAY_REDIRECT" | "GOOGLEPAY_REDIRECT">("CARD_CZ");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: `1px solid ${C.sand}`, background: C.cream,
    fontSize: 14, fontFamily: "Georgia, serif", color: C.text,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
      {children}
    </label>
  );

  const payMethods: { id: typeof payMethod; label: string; icon: React.ReactNode }[] = [
    {
      id: "CARD_CZ",
      label: "Karta",
      icon: (
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <rect x="0.5" y="0.5" width="21" height="15" rx="2.5" stroke="currentColor" strokeOpacity="0.4"/>
          <rect y="4" width="22" height="3" fill="currentColor" fillOpacity="0.25"/>
          <rect x="2" y="10" width="5" height="2" rx="1" fill="currentColor" fillOpacity="0.5"/>
        </svg>
      ),
    },
    {
      id: "APPLEPAY_REDIRECT",
      label: "Apple Pay",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
    },
    {
      id: "GOOGLEPAY_REDIRECT",
      label: "Google Pay",
      icon: (
        <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
          <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#EA4335"/>
          <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4"/>
          <path d="M10.53 28.59c-.48-1.37-.76-2.83-.76-4.59s.27-3.22.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05"/>
          <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853"/>
        </svg>
      ),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.street || !form.city || !form.zip) {
      setError("Vyplňte prosím všechna povinná pole.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId:    pkg.id,
          packageTitle: pkg.title,
          name:    `${form.firstName} ${form.lastName}`,
          email:    form.email,
          phone:    form.phone,
          street:   form.street,
          city:     form.city,
          zip:      form.zip,
          company:  form.company,
          ico:      form.ico,
          method:   payMethod,
        }),
      });
      const data = await res.json();
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        setError(data.error || "Nastala chyba. Zkuste to prosím znovu.");
      }
    } catch {
      setError("Chyba připojení. Zkontrolujte internet a zkuste znovu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 600,
        background: "rgba(28,28,40,0.78)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.cream, borderRadius: 24, maxWidth: 520, width: "100%",
          maxHeight: "92vh", overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.36)",
          position: "relative",
        }}
      >
        {/* Gold top bar */}
        <div style={{ height: 4, background: `linear-gradient(to right, ${C.gold}, ${C.goldLight})`, borderRadius: "24px 24px 0 0" }} />

        <div style={{ padding: "28px 32px 36px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18, padding: "0 6px 0 0", lineHeight: 1 }} title="Zpět">←</button>
            <div>
              <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.2em", fontFamily: "Trebuchet MS, sans-serif" }}>OBJEDNÁVKA</div>
              <h3 style={{ fontSize: 20, fontWeight: "normal", color: C.dark, margin: 0 }}>{pkg.title}</h3>
            </div>
            <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20, lineHeight: 1, width: 32, height: 32, borderRadius: "50%", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.sand)}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}>×</button>
          </div>

          {/* Order summary */}
          <div style={{ background: C.warm, borderRadius: 12, padding: "14px 18px", border: `1px solid ${C.sand}`, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: C.text, fontFamily: "Georgia, serif" }}>{pkg.title}</div>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", marginTop: 3 }}>{pkg.priceNote}</div>
            </div>
            <div style={{ fontSize: 22, color: C.dark, fontFamily: "Georgia, serif" }}>{pkg.price}</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <Label>JMÉNO *</Label>
                <input value={form.firstName} onChange={set("firstName")} placeholder="Jana" required style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = C.gold)} onBlur={e => (e.target.style.borderColor = C.sand)} />
              </div>
              <div>
                <Label>PŘÍJMENÍ *</Label>
                <input value={form.lastName} onChange={set("lastName")} placeholder="Nováková" required style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = C.gold)} onBlur={e => (e.target.style.borderColor = C.sand)} />
              </div>
            </div>

            {/* Email + phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <Label>E-MAIL *</Label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="jana@example.cz" required style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = C.gold)} onBlur={e => (e.target.style.borderColor = C.sand)} />
              </div>
              <div>
                <Label>TELEFON *</Label>
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+420 777 123 456" required style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = C.gold)} onBlur={e => (e.target.style.borderColor = C.sand)} />
              </div>
            </div>

            {/* Street */}
            <div style={{ marginBottom: 12 }}>
              <Label>ULICE A ČÍSLO POPISNÉ *</Label>
              <input value={form.street} onChange={set("street")} placeholder="Václavské náměstí 1" required style={inputStyle}
                onFocus={e => (e.target.style.borderColor = C.gold)} onBlur={e => (e.target.style.borderColor = C.sand)} />
            </div>

            {/* City + ZIP */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12, marginBottom: 12 }}>
              <div>
                <Label>MĚSTO *</Label>
                <input value={form.city} onChange={set("city")} placeholder="Praha" required style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = C.gold)} onBlur={e => (e.target.style.borderColor = C.sand)} />
              </div>
              <div>
                <Label>PSČ *</Label>
                <input value={form.zip} onChange={set("zip")} placeholder="110 00" required style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = C.gold)} onBlur={e => (e.target.style.borderColor = C.sand)} />
              </div>
            </div>

            {/* Company + IČO */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12, marginBottom: 20 }}>
              <div>
                <Label>FIRMA <span style={{ opacity: 0.6, textTransform: "none", letterSpacing: 0 }}>(nepovinné)</span></Label>
                <input value={form.company} onChange={set("company")} placeholder="ReDefine s.r.o." style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = C.gold)} onBlur={e => (e.target.style.borderColor = C.sand)} />
              </div>
              <div>
                <Label>IČO <span style={{ opacity: 0.6, textTransform: "none", letterSpacing: 0 }}>(nepovinné)</span></Label>
                <input value={form.ico} onChange={set("ico")} placeholder="12345678" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = C.gold)} onBlur={e => (e.target.style.borderColor = C.sand)} />
              </div>
            </div>

            {/* Payment method selector */}
            <div style={{ marginBottom: 20 }}>
              <Label>ZPŮSOB PLATBY</Label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {payMethods.map(m => {
                  const active = payMethod === m.id;
                  return (
                    <button
                      key={m.id} type="button" onClick={() => setPayMethod(m.id)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "12px 8px", borderRadius: 12, cursor: "pointer",
                        border: `2px solid ${active ? C.gold : C.sand}`,
                        background: active ? "rgba(201,168,76,0.08)" : C.cream,
                        color: active ? C.gold : C.muted,
                        transition: "all 0.18s",
                      }}
                      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = C.muted; } }}
                      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = C.sand; } }}
                    >
                      {m.icon}
                      <span style={{ fontSize: 11, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.05em", fontWeight: active ? "bold" : "normal" }}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(200,80,80,0.08)", border: "1px solid rgba(200,80,80,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#C85050", fontFamily: "Trebuchet MS, sans-serif" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "15px 0",
                background: loading ? C.sand : `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                border: "none", borderRadius: 12,
                color: C.darker, fontSize: 14, fontFamily: "Trebuchet MS, sans-serif",
                fontWeight: "bold", letterSpacing: "0.08em",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              {loading ? "Přesměrování na platební bránu…" : `ZAPLATIT ${pkg.price}`}
            </button>

            <p style={{ fontSize: 11, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
              Platba je zpracována bezpečně přes ComGate.<br />Po zaplacení obdržíte e-mailem potvrzení a fakturu.
            </p>
          </form>
        </div>
      </div>
    </div>
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

// ── Consultation Modal ────────────────────────────────────────────────────────
function ConsultationModal({ pkg, onClose, onPay }: {
  pkg: typeof consultationData.packages[0];
  onClose: () => void;
  onPay: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "rgba(28,28,40,0.72)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.cream, borderRadius: 24, maxWidth: 560, width: "100%",
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.36)",
          position: "relative",
        }}
      >
        {/* Gold top bar */}
        <div style={{ height: 4, background: `linear-gradient(to right, ${C.gold}, ${C.goldLight})`, borderRadius: "24px 24px 0 0" }} />

        <div style={{ padding: "32px 36px 36px" }}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 20, right: 20,
              background: "none", border: "none", cursor: "pointer",
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              color: C.muted, fontSize: 20, lineHeight: 1,
              borderRadius: "50%", transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = C.sand)}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >×</button>

          {/* Title */}
          <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.2em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 10 }}>
            KONZULTACE & MENTORING
          </div>
          <h3 style={{ fontSize: 26, fontWeight: "normal", margin: "0 0 6px", color: C.dark }}>{pkg.title}</h3>
          <p style={{ fontSize: 15, color: C.gold, fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.5 }}>{pkg.tagline}</p>

          <div style={{ height: 1, background: C.sand, marginBottom: 24 }} />

          {/* Card description */}
          <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.85, marginBottom: 16 }}>{pkg.cardDesc}</p>

          {/* Modal teaser */}
          <p style={{ fontSize: 14.5, color: C.text, lineHeight: 1.85, marginBottom: pkg.result ? 8 : 24 }}>{pkg.modalDesc}</p>

          {/* Result */}
          {pkg.result && (
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, fontStyle: "italic", marginBottom: 24 }}>{pkg.result}</p>
          )}

          {/* Format */}
          {pkg.format && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: C.warm, borderRadius: 10, padding: "12px 16px", marginBottom: 24,
              border: `1px solid ${C.sand}`,
            }}>
              <div style={{ width: 3, height: 28, background: C.gold, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", lineHeight: 1.6 }}>{pkg.format}</span>
            </div>
          )}

          <div style={{ height: 1, background: C.sand, marginBottom: 24 }} />

          {/* Price */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 32, color: C.dark, lineHeight: 1 }}>{pkg.price}</div>
              <div style={{ fontSize: 12, color: C.muted, fontFamily: "Trebuchet MS, sans-serif", marginTop: 6 }}>{pkg.priceNote}</div>
            </div>
          </div>

          {/* CTA */}
          <button
            style={{
              width: "100%", padding: "15px 0",
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              border: "none", borderRadius: 12,
              color: C.darker, fontSize: 14, fontFamily: "Trebuchet MS, sans-serif",
              fontWeight: "bold", letterSpacing: "0.08em", cursor: "pointer",
              marginBottom: 14, transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            onClick={onPay}
          >
            ZAPLATIT
          </button>

          {/* Calendar link */}
          <div style={{ textAlign: "center" }}>
            <a
              href="#kontakt"
              onClick={e => { e.preventDefault(); onClose(); document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                fontSize: 13, color: C.muted, fontFamily: "Trebuchet MS, sans-serif",
                textDecoration: "none", letterSpacing: "0.04em",
                borderBottom: `1px solid ${C.sand}`, paddingBottom: 1,
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.gold; (e.currentTarget as HTMLElement).style.borderBottomColor = C.gold; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.muted; (e.currentTarget as HTMLElement).style.borderBottomColor = C.sand; }}
            >
              Naplánujte setkání zde →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const scrollY = useScrollY();
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width < 1024;
  const [menuOpen, setMenuOpen] = useState(false);
  const [proKouceOpen, setProKouceOpen] = useState(false);
  const [proVerejnostOpen, setProVerejnostOpen] = useState(false);
  const [proKouceHover, setProKouceHover] = useState(false);
  const [proVerejnostHover, setProVerejnostHover] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [activeEpisode, setActiveEpisode] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [openWorkshopModal, setOpenWorkshopModal] = useState(false);
  const [checkoutPkg, setCheckoutPkg] = useState<typeof consultationData.packages[0] | null>(null);
  const reserveBtnRef = useRef<HTMLDivElement>(null);
  const [navDarkness, setNavDarkness] = useState(1); // 1=dark, 0=light, floats in between

  // Smooth scroll-based nav color interpolation
  useEffect(() => {
    const darkSet = new Set(["hero", "vycvik", "podcast"]);
    const sections = ["hero", "o-mne", "konzultace", "supervize", "vycvik", "pro-bono", "videa", "podcast", "kontakt"];

    const BLEND = 120; // px blend zone around section boundary
    const NAV_H = 58;
    let raf: number;

    const update = () => {
      let darkness = 1;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= NAV_H) {
          const curDark = darkSet.has(sections[i]) ? 1 : 0;
          const nextId = sections[i + 1];
          if (nextId) {
            const nextEl = document.getElementById(nextId);
            if (nextEl) {
              const nextDark = darkSet.has(nextId) ? 1 : 0;
              const dist = nextEl.getBoundingClientRect().top - NAV_H;
              if (dist > -BLEND && dist < BLEND) {
                const t = (dist + BLEND) / (BLEND * 2);
                darkness = curDark * t + nextDark * (1 - t);
              } else { darkness = curDark; }
            } else { darkness = curDark; }
          } else { darkness = curDark; }
          break;
        }
      }
      setNavDarkness(darkness);
    };

    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Interpolate nav colors continuously
  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  // Glass panel invisible on hero, fades in smoothly after scrolling ~40% of viewport
  const heroFadeStart = typeof window !== "undefined" ? window.innerHeight * 0.15 : 300;
  const navAlpha = Math.min(1, Math.max(0, (scrollY - heroFadeStart) / 120));
  const nr = lerp(250, 44, navDarkness); const ng = lerp(248, 44, navDarkness); const nb = lerp(244, 62, navDarkness);
  const navBg = `rgba(${nr},${ng},${nb},${(0.78 * navAlpha).toFixed(2)})`;
  const navBorder = `rgba(${lerp(201, 255, navDarkness)},${lerp(192, 255, navDarkness)},${lerp(168, 255, navDarkness)},${((0.12) * navAlpha).toFixed(2)})`;
  // Text: interpolate RGB dark(80,70,55) ↔ white(255,255,255), fully white when hero transparent
  const tr = navAlpha < 0.05 ? 255 : lerp(80, 255, navDarkness);
  const tg = navAlpha < 0.05 ? 255 : lerp(70, 255, navDarkness);
  const tb = navAlpha < 0.05 ? 255 : lerp(55, 255, navDarkness);
  const navText = `rgba(${tr},${tg},${tb},0.85)`;
  const navLogoColor = navAlpha < 0.05 ? "#ffffff" : `rgb(${lerp(44, 255, navDarkness)},${lerp(44, 255, navDarkness)},${lerp(62, 255, navDarkness)})`;
  const hamburgerColor = navLogoColor;

  const scrollTo = (id: string) => {
    const map: Record<string, string> = { "o mně": "o-mne", "konzultace": "konzultace", "kurzy": "kurzy", "pro veřejnost": "konzultace", "supervize": "supervize", "výcvik": "vycvik", "pro kouče": "supervize", "pro bono": "pro-bono", "videa": "videa", "podcast": "podcast", "kontakt": "kontakt" };
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
        position: "fixed", top: 0, left: 0, right: 0, zIndex: menuOpen ? 50 : 100,
        background: menuOpen ? "transparent" : navBg,
        backdropFilter: menuOpen || navAlpha < 0.05 ? "none" : "blur(24px) saturate(180%)",
        WebkitBackdropFilter: menuOpen || navAlpha < 0.05 ? "none" : "blur(24px) saturate(180%)",
        borderBottom: menuOpen ? "none" : `1px solid ${navBorder}`,
        padding: isMobile ? "0 32px" : `0 ${px}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 58,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          {!isMobile && <div style={{ width: 3, height: 24, background: C.gold, borderRadius: 2 }} />}
          <div>
            <div style={{ fontSize: isMobile ? 20 : 17, fontFamily: isMobile ? "Georgia, serif" : undefined, color: menuOpen ? "transparent" : navLogoColor, letterSpacing: isMobile ? "0.04em" : "0.03em" }}>Iveta Clarke</div>
            <div style={{ fontSize: isMobile ? 8 : 9, color: C.gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif", opacity: menuOpen ? 0 : 1 }}>INSPIRING CONVERSATION</div>
          </div>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: "flex", gap: isTablet ? 18 : 28, alignItems: "center" }}>
            {navItems.map(item => {
              const isDropdown = item === "Pro Kouče" || item === "Pro veřejnost";
              const isHovered = item === "Pro Kouče" ? proKouceHover : proVerejnostHover;
              const setHovered = item === "Pro Kouče" ? setProKouceHover : setProVerejnostHover;
              const subItems = item === "Pro Kouče" ? proKouceItems : proVerejnostItems;
              if (isDropdown) return (
                <div key={item} style={{ position: "relative" }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <button style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 15, fontFamily: "Trebuchet MS, sans-serif",
                    color: isHovered ? C.gold : navText,
                    padding: "4px 0", display: "flex", alignItems: "center", gap: 5,
                    transition: "color 0.2s",
                  }}>
                    {item}
                    <span style={{ fontSize: 9, opacity: 0.7, display: "inline-block", transform: isHovered ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                  </button>
                  {/* Dropdown panel — always rendered, toggled by opacity */}
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)",
                    background: `rgba(${nr},${ng},${nb},0.97)`,
                    backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                    border: `1px solid ${navBorder}`, borderRadius: 12,
                    padding: "6px 0", flexDirection: "column", minWidth: 160, zIndex: 300,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
                    display: "flex",
                    opacity: isHovered ? 1 : 0,
                    pointerEvents: isHovered ? "auto" : "none",
                    transition: "opacity 0.18s ease",
                  }}>
                    {subItems.map(sub => (
                      <button key={sub} onClick={() => scrollTo(sub.toLowerCase())}
                        style={{
                          background: "none", border: "none", cursor: "pointer", textAlign: "left",
                          fontSize: 14, fontFamily: "Trebuchet MS, sans-serif",
                          color: navText, padding: "11px 20px", whiteSpace: "nowrap",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = C.gold}
                        onMouseLeave={e => e.currentTarget.style.color = navText}
                      >{sub}</button>
                    ))}
                  </div>
                </div>
              );
              return (
                <button key={item} onClick={() => scrollTo(item.toLowerCase())}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 15, fontFamily: "Trebuchet MS, sans-serif",
                    color: navText, padding: "4px 0",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = C.gold}
                  onMouseLeave={e => e.currentTarget.style.color = navText}
                >{item}</button>
              );
            })}
            <Btn small onClick={() => scrollTo("pro veřejnost")}>Rezervovat</Btn>
          </div>
        )}

        {/* Mobile hamburger – hidden when overlay is open (overlay has its own X) */}
        {isMobile && !menuOpen && (
          <button onClick={() => setMenuOpen(true)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 8,
            display: "flex", flexDirection: "column", gap: 5,
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 24, height: 2, borderRadius: 2,
                background: hamburgerColor,
              }} />
            ))}
          </button>
        )}
      </nav>

      {/* Mobile menu overlay – full screen, hero colours */}
      {isMobile && menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: `linear-gradient(160deg, ${C.darker} 0%, #3A2C4E 55%, ${C.dark} 100%)`,
          display: "flex", flexDirection: "column",
          padding: "0 32px 40px",
          overflowY: "auto",
        }}>
          {/* Top bar inside overlay */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 20, color: "#ffffff", letterSpacing: "0.04em", fontFamily: "Georgia, serif" }}>Iveta Clarke</div>
              <div style={{ fontSize: 8, color: C.gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif" }}>INSPIRING CONVERSATION</div>
            </div>
            {/* Close X */}
            <button onClick={() => setMenuOpen(false)} style={{
              background: "none", border: "none", cursor: "pointer", padding: 8,
              display: "flex", flexDirection: "column", gap: 5,
            }}>
              {[0, 2].map(i => (
                <div key={i} style={{
                  width: 24, height: 2, borderRadius: 2, background: "#ffffff",
                  transform: i === 0 ? "rotate(45deg) translate(5px, 5px)" : "rotate(-45deg) translate(5px, -5px)",
                }} />
              ))}
            </button>
          </div>

          {/* Gold divider */}
          <div style={{ height: 1, background: `linear-gradient(to right, ${C.gold}, transparent)`, marginBottom: 40, animation: "menuLineIn 0.5s ease forwards" }} />

          {/* Nav items */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
            {navItems.map((item, i) => (item === "Pro Kouče" || item === "Pro veřejnost") ? (
              <div key={item} style={{ opacity: 0, animation: `menuItemIn 0.45s ease ${0.08 + i * 0.07}s forwards` }}>
                {/* Dropdown toggle */}
                <button
                  onClick={() => item === "Pro Kouče" ? setProKouceOpen(o => !o) : setProVerejnostOpen(o => !o)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", textAlign: "left",
                    fontSize: "clamp(26px, 8vw, 36px)", fontFamily: "Georgia, serif",
                    color: "#ffffff", fontWeight: "normal",
                    padding: "14px 0", width: "100%",
                    borderBottom: (item === "Pro Kouče" ? proKouceOpen : proVerejnostOpen) ? "none" : "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}
                >
                  {item}
                  <span style={{ color: C.gold, fontSize: "0.55em", transition: "transform 0.25s", display: "inline-block", transform: (item === "Pro Kouče" ? proKouceOpen : proVerejnostOpen) ? "rotate(90deg)" : "none" }}>▾</span>
                </button>
                {/* Submenu */}
                {(item === "Pro Kouče" ? proKouceOpen : proVerejnostOpen) && (
                  <div style={{ paddingLeft: 20, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {(item === "Pro Kouče" ? proKouceItems : proVerejnostItems).map(sub => (
                      <button key={sub}
                        onClick={() => scrollTo(sub.toLowerCase())}
                        style={{
                          background: "none", border: "none", cursor: "pointer", textAlign: "left",
                          fontSize: "clamp(18px, 5.5vw, 26px)", fontFamily: "Georgia, serif",
                          color: "rgba(255,255,255,0.75)", fontWeight: "normal",
                          padding: "10px 0", width: "100%",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}
                        onTouchStart={e => (e.currentTarget.style.color = C.gold)}
                        onTouchEnd={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                      >
                        {sub}
                        <span style={{ color: C.gold, fontSize: "0.5em", opacity: 0.7 }}>→</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                style={{
                  background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  fontSize: "clamp(26px, 8vw, 36px)", fontFamily: "Georgia, serif",
                  color: "#ffffff", fontWeight: "normal",
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  opacity: 0,
                  animation: `menuItemIn 0.45s ease ${0.08 + i * 0.07}s forwards`,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
                onTouchStart={e => (e.currentTarget.style.color = C.gold)}
                onTouchEnd={e => (e.currentTarget.style.color = "#ffffff")}
              >
                {item}
                <span style={{ color: C.gold, fontSize: "0.5em", opacity: 0.7 }}>→</span>
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div style={{ marginTop: 40, opacity: 0, animation: `menuItemIn 0.45s ease ${0.08 + navItems.length * 0.07}s forwards` }}>
            <button onClick={() => scrollTo("konzultace")} style={{
              width: "100%", padding: "18px 0",
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              color: C.darker, border: "none", borderRadius: 8,
              fontSize: 15, fontFamily: "Trebuchet MS, sans-serif",
              letterSpacing: "0.08em", cursor: "pointer", fontWeight: "bold",
            }}>
              REZERVOVAT KONZULTACI
            </button>
          </div>

          {/* Tagline */}
          <div style={{ marginTop: 24, fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif", textAlign: "center", opacity: 0, animation: `menuItemIn 0.45s ease ${0.15 + navItems.length * 0.07}s forwards` }}>
            INSPIRING CONVERSATION
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="hero" style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center",
        background: `linear-gradient(160deg, ${C.darker} 0%, #3A2C4E 50%, ${C.dark} 100%)`,
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", opacity: 0.65 }}>
          <DandelionCanvas targetRef={reserveBtnRef} />
        </div>

        <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "100px 24px 72px" : `calc(120px - 6vh) ${px} 80px`, maxWidth: isMobile ? "100%" : 700 }}>
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
          <p style={{ fontSize: isMobile ? 14 : 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, fontStyle: "italic", maxWidth: 480, margin: isMobile ? "0 0 40px" : "0 0 80px", opacity: 0, animation: "fadeUp 0.8s ease 0.78s forwards" }}>
            {heroData.mission}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.8s ease 0.85s forwards" }}>
            <div ref={reserveBtnRef} style={{ display: "inline-block" }}>
              <Btn onClick={() => scrollTo("konzultace")}>Rezervovat konzultaci</Btn>
            </div>
            <Btn primary={false} onClick={() => scrollTo("videa")}>Prozkoumat videa →</Btn>
          </div>
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
      <section id="o-mne" style={{ padding: isMobile ? "64px 24px" : `80px ${px}`, position: "relative", overflow: "visible" }}>
        <img
            src="/points.png"
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              top: isMobile ? 40 : 30,
              left: isMobile ? "55%" : "35%",
              transform: "translateX(-50%)",
              animation: "pointsReveal 6s cubic-bezier(0.16,1,0.3,1) forwards",
              width: isMobile ? 280 : 420,
              pointerEvents: "none",
              zIndex: 5,
              mixBlendMode: "multiply",
              opacity: 0.9,
            }}
          />
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
            {aboutData.longBio.map((p, i) => (
              <p key={i} style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.9, marginBottom: 16 }}>{p}</p>
            ))}
            {/* LinkedIn link */}
            <a href="https://www.linkedin.com/in/ivetaclarke" target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
                color: C.muted, textDecoration: "none", fontSize: 13,
                fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Spojte se se mnou na LinkedIn
            </a>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 0 }}>
              {([
                { target: 25, suffix: "+", label: "let zkušeností" },
                { target: 500, suffix: "+", label: "klientů" },
                { target: 3500, suffix: "+", label: "hodin s klienty" },
              ]).map(({ target, suffix, label }) => (
                <div key={label} style={{ textAlign: "center", padding: "20px 12px", background: C.warm, borderRadius: 12, border: `1px solid ${C.sand}` }}>
                  <div style={{ fontSize: 28, color: C.gold, marginBottom: 4 }}>
                    <CountUp target={target} suffix={suffix} duration={3200} />
                  </div>
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
            </div>
          </Reveal>
        </div>
        </div>
      </section>

      {/* ── KONZULTACE ───────────────────────────────────────────────────── */}
      {openModal && (() => {
        const allPkgs = [...consultationData.packages, ...supervisionData.packages];
        const pkg = allPkgs.find(p => p.id === openModal);
        return pkg ? (
          <ConsultationModal
            pkg={pkg}
            onClose={() => setOpenModal(null)}
            onPay={() => { setCheckoutPkg(pkg); setOpenModal(null); }}
          />
        ) : null;
      })()}

      {openWorkshopModal && !checkoutPkg && (
        <WorkshopModal
          onClose={() => setOpenWorkshopModal(false)}
          onPay={pkg => { setCheckoutPkg(pkg); setOpenWorkshopModal(false); }}
        />
      )}

      {checkoutPkg && (
        <CheckoutModal
          pkg={checkoutPkg}
          onClose={() => setCheckoutPkg(null)}
          onBack={() => {
            const isWorkshop = checkoutPkg.id.startsWith("ws-");
            if (isWorkshop) { setOpenWorkshopModal(true); }
            else { setOpenModal(checkoutPkg.id); }
            setCheckoutPkg(null);
          }}
        />
      )}

      <section id="konzultace" style={{ background: C.warm, padding: isMobile ? "64px 24px" : `80px ${px}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>KONZULTACE & MENTORING</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px" }}>Jak mohu pomoci</h2>
            <Divider />
          </Reveal>

          {/* Intro text */}
          <Reveal delay={0.05}>
            <div style={{ marginBottom: 52 }}>
              {consultationData.intro.map((para, i) => (
                <p key={i} style={{
                  fontSize: i === 0 ? 18 : 15,
                  color: i === 0 ? C.text : C.muted,
                  lineHeight: 1.85,
                  marginBottom: i === consultationData.intro.length - 1 ? 0 : 14,
                  fontStyle: i === 0 ? "italic" : "normal",
                  fontWeight: i === 0 ? "normal" : "normal",
                }}>{para}</p>
              ))}
            </div>
          </Reveal>

          {/* Top 2 individual cards */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, marginBottom: 32 }}>
            {consultationData.packages.slice(0, 2).map((pkg, i) => (
              <Reveal key={pkg.id} delay={0.1 + i * 0.1}>
                <div style={{
                  background: C.white, borderRadius: 20, padding: "28px 32px",
                  border: `1px solid ${C.sand}`,
                  boxShadow: "0 4px 32px rgba(44,44,62,0.06)",
                  display: "flex", flexDirection: "column", height: "100%",
                }}>
                  <div style={{ width: 4, height: 3, background: C.gold, borderRadius: 2, marginBottom: 16 }} />
                  <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.2em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 8 }}>{pkg.format?.toUpperCase()}</div>
                  <h3 style={{ fontSize: 18, fontWeight: "normal", margin: "0 0 12px" }}>{pkg.title}</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: "0 0 24px", flex: 1 }}>{pkg.cardDesc}</p>
                  <div style={{ borderTop: `1px solid ${C.sand}`, paddingTop: 20, display: "flex", justifyContent: "flex-end" }}>
                    <Btn small onClick={() => setOpenModal(pkg.id)}>Chci vědět více</Btn>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom 3 package cards */}
          <Reveal delay={0.15}>
            <h3 style={{ fontSize: 18, fontWeight: "normal", color: C.dark, margin: "0 0 20px" }}>Možnosti spolupráce</h3>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)", gap: 20 }}>
            {consultationData.packages.slice(2).map((pkg, i) => (
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
                    <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 6 }}>
                      {pkg.format?.split("·").pop()?.trim().toUpperCase()}
                    </div>
                    <div style={{ fontSize: 17, color: C.dark, marginBottom: 12, lineHeight: 1.3 }}>{pkg.title}</div>
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, marginBottom: 20, flex: 1 }}>{pkg.cardDesc}</p>
                    <button
                      onClick={() => setOpenModal(pkg.id)}
                      style={{
                        width: "100%", padding: "11px 0",
                        background: C.gold, border: "none", borderRadius: 32,
                        color: C.dark, fontSize: 12, fontFamily: "Trebuchet MS, sans-serif",
                        fontWeight: "bold", cursor: "pointer", letterSpacing: "0.04em",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.goldLight)}
                      onMouseLeave={e => (e.currentTarget.style.background = C.gold)}
                    >Chci vědět více</button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Note */}
          <Reveal delay={0.3}>
            <div style={{ marginTop: 32, padding: "18px 24px", background: C.cream, borderRadius: 12, border: `1px solid ${C.sand}` }}>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
                {consultationData.note}
              </p>
            </div>
          </Reveal>

          {/* ── KURZY ── */}
          <div id="kurzy" style={{ marginTop: 64 }}>
            <Reveal>
              <SectionLabel>ONLINE KURZY</SectionLabel>
              <h2 style={{ fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: "normal", margin: "0 0 8px" }}>Kurzy na Seduo</h2>
              <Divider />
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 28, marginTop: 8, alignItems: "stretch" }}>
              {seduoCourses.map((course, i) => (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <a href={course.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", height: "100%" }}>
                    <div style={{
                      background: C.white, borderRadius: 16,
                      border: `1px solid ${C.sand}`,
                      boxShadow: "0 4px 24px rgba(44,44,62,0.06)",
                      overflow: "hidden",
                      transition: "box-shadow 0.25s, transform 0.25s",
                      cursor: "pointer",
                      display: "flex", flexDirection: "column", height: "100%",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 48px rgba(44,44,62,0.14)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(44,44,62,0.06)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                    >
                      {/* Preview image */}
                      <div style={{ width: "100%", height: isMobile ? 200 : 300, overflow: "hidden", flexShrink: 0, position: "relative", background: C.warm }}>
                        <img
                          src={course.image}
                          alt={course.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        {/* Seduo badge */}
                        <div style={{
                          position: "absolute", top: 12, left: 12,
                          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                          borderRadius: 6, padding: "4px 10px",
                          fontSize: 10, color: "#ffffff", fontFamily: "Trebuchet MS", letterSpacing: "0.15em",
                        }}>SEDUO.CZ</div>
                      </div>
                      {/* Text content */}
                      <div style={{ padding: isMobile ? "22px 24px" : "14px 20px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <div style={{ fontSize: isMobile ? 16 : 15, color: C.dark, marginBottom: 10, lineHeight: 1.4, fontFamily: "Georgia, serif" }}>{course.title}</div>
                        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: "0 0 14px", flex: 1 }}>{course.desc}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.gold, fontSize: 13, fontFamily: "Trebuchet MS", letterSpacing: "0.05em" }}>
                          Přejít na kurz <span>→</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
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

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 60, marginBottom: 52 }}>
            <Reveal>
              <h3 style={{ fontSize: 20, fontWeight: "normal", margin: "0 0 10px" }}>Co je supervize?</h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 6 }}>{supervisionData.intro}</p>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20 }}>{supervisionData.introSub}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {supervisionData.functions.map(f => (
                  <div key={f.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(201,168,76,0.1)", border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.gold, flexShrink: 0, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold" }}>
                      {f.label[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: "bold", color: C.dark, fontFamily: "Trebuchet MS, sans-serif", marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 style={{ fontSize: 20, fontWeight: "normal", margin: "0 0 16px" }}>Moje kvalifikace</h3>
              <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.9, marginBottom: 12 }}>{supervisionData.qualification}</p>
              <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.9, marginBottom: 20 }}>{supervisionData.qualificationSub}</p>
              <a href="https://www.linkedin.com/in/ivetaclarke" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.muted, textDecoration: "none", fontSize: 13, fontFamily: "Trebuchet MS, sans-serif", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Certifikáty na LinkedIn →
              </a>
            </Reveal>
          </div>

          {/* Package cards */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
            {supervisionData.packages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={0.1 + i * 0.1}>
                <div style={{
                  background: C.white, borderRadius: 20, padding: "28px 32px",
                  border: `1px solid ${C.sand}`,
                  boxShadow: "0 4px 32px rgba(44,44,62,0.06)",
                  display: "flex", flexDirection: "column", height: "100%",
                }}>
                  <div style={{ width: 4, height: 3, background: C.gold, borderRadius: 2, marginBottom: 16 }} />
                  <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.2em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 8 }}>{pkg.format?.toUpperCase()}</div>
                  <h3 style={{ fontSize: 18, fontWeight: "normal", margin: "0 0 8px" }}>{pkg.title}</h3>
                  <p style={{ fontSize: 13.5, color: C.gold, fontStyle: "italic", margin: "0 0 12px", lineHeight: 1.5, fontFamily: "Georgia, serif" }}>{pkg.tagline}</p>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: "0 0 24px", flex: 1 }}>{pkg.cardDesc}</p>
                  <div style={{ borderTop: `1px solid ${C.sand}`, paddingTop: 20, display: "flex", justifyContent: "flex-end" }}>
                    <Btn small onClick={() => setOpenModal(pkg.id)}>Chci vědět více</Btn>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VÝCVIK ───────────────────────────────────────────────────────── */}
      <section id="vycvik" style={{ padding: isMobile ? "64px 24px" : `80px ${px}`, background: C.dark }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>PRO KOUČE</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px", color: C.white }}>Výcvik</h2>
            <Divider />
          </Reveal>

          <Reveal delay={0.08}>
            {/* Header */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 10, color: C.gold, letterSpacing: "0.25em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 10 }}>WORKSHOP PRO PROFESIONÁLNÍ KOUČE</div>
              <h3 style={{ fontSize: 28, color: C.white, fontWeight: "normal", margin: "0 0 6px" }}>{supervisionData.workshop.title}</h3>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 24 }}>{supervisionData.workshop.subtitle}</div>
              {supervisionData.workshop.descParagraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 14.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 14 }}>{p}</p>
              ))}
            </div>
          </Reveal>

          {/* Ve workshopu se dozvíte */}
          <Reveal delay={0.1}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.2em", fontFamily: "Trebuchet MS, sans-serif", marginBottom: 16 }}>VE WORKSHOPU SE DOZVÍTE</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                {supervisionData.workshop.learns.map(area => (
                  <div key={area.title} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 12, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold", marginBottom: 10 }}>{area.title.toUpperCase()}</div>
                    <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                      {area.items.map((item, j) => (
                        <li key={j} style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 4 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Curriculum + Bonusy */}
          <Reveal delay={0.12}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16, marginBottom: 40 }}>
              {/* Den 1 */}
              <div style={{ background: "rgba(201,168,76,0.08)", borderRadius: 12, padding: "18px 20px", border: "1px solid rgba(201,168,76,0.2)" }}>
                <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold", marginBottom: 10 }}>{supervisionData.workshop.day1.title.toUpperCase()}</div>
                {supervisionData.workshop.day1.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold, marginTop: 7, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
              {/* Den 2 */}
              <div style={{ background: "rgba(201,168,76,0.08)", borderRadius: 12, padding: "18px 20px", border: "1px solid rgba(201,168,76,0.2)" }}>
                <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", fontWeight: "bold", marginBottom: 10 }}>{supervisionData.workshop.day2.title.toUpperCase()}</div>
                {supervisionData.workshop.day2.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold, marginTop: 7, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
              {/* Bonusy */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {supervisionData.workshop.bonuses.map(b => (
                  <div key={b.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.1)", flex: 1 }}>
                    <div style={{ fontSize: 10, color: C.gold, fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 6 }}>{b.label.toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: C.white, marginBottom: 6 }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Logistics + CTA */}
          <Reveal delay={0.14}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 48 }}>
              {/* Logistics */}
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 16 }}>ORGANIZAČNÍ INFORMACE</div>
                {[supervisionData.workshop.date, supervisionData.workshop.earlyBird, supervisionData.workshop.maxParticipants, supervisionData.workshop.hours].map(info => (
                  <div key={info} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, flexShrink: 0, marginTop: 6 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontFamily: "Trebuchet MS, sans-serif", lineHeight: 1.5 }}>{info}</span>
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 8px" }}>{supervisionData.workshop.note}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{supervisionData.workshop.preCondition}</p>
                </div>
              </div>
              {/* CTA */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "0.15em", marginBottom: 16 }}>VARIANTY ÚČASTI</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 28 }}>
                  {supervisionData.workshop.packages.map(pkg => (
                    <div key={pkg.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontFamily: "Trebuchet MS, sans-serif" }}>{pkg.title}</span>
                    </div>
                  ))}
                </div>
                <Btn onClick={() => setOpenWorkshopModal(true)} pulse>Zaregistrovat se</Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRO BONO ─────────────────────────────────────────────────────── */}
      <section id="pro-bono" style={{ padding: isMobile ? "64px 24px" : `80px ${px}`, background: C.warm }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>PRO BONO</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px" }}>Bezplatná podpora</h2>
            <Divider />
            <p style={{ fontSize: 15.5, color: C.muted, lineHeight: 1.9, maxWidth: 680 }}>
              Obsah této sekce bude doplněn. Pokud máte zájem o více informací, neváhejte mě kontaktovat.
            </p>
            <div style={{ marginTop: 32 }}>
              <Btn onClick={() => scrollTo("kontakt")}>Kontaktujte mě</Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── VIDEA ────────────────────────────────────────────────────────── */}
      <section id="videa" style={{ padding: isMobile ? "64px 24px" : `80px ${px}`, background: C.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>VIDEA</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px" }}>Iveta v rozhovorech a pořadech</h2>
            <Divider />
          </Reveal>

          {/* YouTube videa */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, marginBottom: 64 }}>
            {youtubeVideos.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}>
                <div style={{ borderRadius: 14, overflow: "hidden", background: C.dark, boxShadow: "0 4px 24px rgba(44,44,62,0.12)" }}>
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}`}
                      title={v.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    />
                  </div>
                  <div style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{v.title}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Video série */}
          <Reveal>
            <SectionLabel>SÉRIE PŘEDNÁŠEK</SectionLabel>
            <h2 style={{ fontSize: "clamp(24px, 2.5vw, 34px)", fontWeight: "normal", margin: "0 0 8px" }}>Série krátkých přednášek</h2>
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
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>PODCAST</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "normal", margin: "0 0 8px", color: C.white }}>Každopádně Kladně – Zámyslník 1.0</h2>
            <Divider />
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 32, fontFamily: "Trebuchet MS" }}>Inspirativní přemýšlení nahlas o tématech, která hýbají našimi životy.</p>
          </Reveal>

          {/* Zámyslník epizody */}
          <Reveal delay={0.1}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS", letterSpacing: "0.15em" }}>ZÁMYSLNÍK IVETY CLARKE</div>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {episodes.filter(e => e.type === "Zámyslník").map((ep, i) => (
                  <div key={ep.id}>
                    <button
                      onClick={() => setActiveEpisode(activeEpisode === ep.id ? null : ep.id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 14,
                        background: activeEpisode === ep.id ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${activeEpisode === ep.id ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.07)"}`,
                        borderRadius: activeEpisode === ep.id ? "12px 12px 0 0" : 12,
                        padding: "14px 18px", cursor: "pointer", textAlign: "left",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: activeEpisode === ep.id ? C.gold : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                        <span style={{ fontSize: 10, color: activeEpisode === ep.id ? "#000" : "rgba(255,255,255,0.5)" }}>{activeEpisode === ep.id ? "▼" : "▶"}</span>
                      </div>
                      <span style={{ fontSize: 15, color: C.white, fontWeight: "normal", flex: 1 }}>{ep.title}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "Trebuchet MS" }}>EP {episodes.indexOf(ep) + 1}</span>
                    </button>
                    {activeEpisode === ep.id && (
                      <div style={{ borderRadius: "0 0 12px 12px", overflow: "hidden", border: "1px solid rgba(201,168,76,0.3)", borderTop: "none" }}>
                        <iframe
                          src={`https://open.spotify.com/embed/episode/${ep.id}?utm_source=generator&theme=0&autoplay=1`}
                          width="100%" height="152" frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          style={{ display: "block" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Epizody s hosty */}
          <Reveal delay={0.15}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS", letterSpacing: "0.15em" }}>ZÁMYSLNÍK S HOSTY</div>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {episodes.filter(e => e.type === "Epizoda s hosty").map((ep) => (
                  <div key={ep.id}>
                    <button
                      onClick={() => setActiveEpisode(activeEpisode === ep.id ? null : ep.id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 14,
                        background: activeEpisode === ep.id ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${activeEpisode === ep.id ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.07)"}`,
                        borderRadius: activeEpisode === ep.id ? "12px 12px 0 0" : 12,
                        padding: "14px 18px", cursor: "pointer", textAlign: "left",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: activeEpisode === ep.id ? C.gold : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                        <span style={{ fontSize: 10, color: activeEpisode === ep.id ? "#000" : "rgba(255,255,255,0.5)" }}>{activeEpisode === ep.id ? "▼" : "▶"}</span>
                      </div>
                      <span style={{ fontSize: 15, color: C.white, fontWeight: "normal", flex: 1 }}>{ep.title}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "Trebuchet MS" }}>EP {episodes.indexOf(ep) + 1}</span>
                    </button>
                    {activeEpisode === ep.id && (
                      <div style={{ borderRadius: "0 0 12px 12px", overflow: "hidden", border: "1px solid rgba(201,168,76,0.3)", borderTop: "none" }}>
                        <iframe
                          src={`https://open.spotify.com/embed/episode/${ep.id}?utm_source=generator&theme=0&autoplay=1`}
                          width="100%" height="152" frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          style={{ display: "block" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Odkazy na platformy + Kód Moudrosti */}
          <Reveal delay={0.2}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "Trebuchet MS", marginBottom: 14 }}>Všechny epizody k poslechu na:</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="https://open.spotify.com/show/4eDcqMArBDuEFbLKPzCqH2" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "#1DB954", borderRadius: 20, fontSize: 12, color: "#000", fontFamily: "Trebuchet MS", textDecoration: "none", fontWeight: "bold" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                  Spotify
                </a>
                <a href="https://podcasts.apple.com/cz/podcast/ka%C5%BEdop%C3%A1dn%C4%9B-k-ladn%C4%9B/id1610747328" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Trebuchet MS", textDecoration: "none" }}>
                  Apple Podcasts
                </a>
              </div>
            </div>
          </Reveal>

          {/* Kód Moudrosti – coming soon */}
          <Reveal delay={0.25}>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "28px", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: C.gold, fontFamily: "Trebuchet MS", letterSpacing: "0.15em", marginBottom: 6 }}>MODEROVANÝ PODCAST S HOSTY</div>
                <h3 style={{ fontSize: 20, color: C.white, fontWeight: "normal", margin: "0 0 6px" }}>Zámyslník 2.0.</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>Hloubkové rozhovory o moudrosti, životě a proměně. S hosty a na videu.</p>
              </div>
              <div style={{ fontSize: 9, background: "rgba(201,168,76,0.2)", color: C.gold, padding: "6px 16px", borderRadius: 12, fontFamily: "Trebuchet MS", border: `1px solid rgba(201,168,76,0.3)`, whiteSpace: "nowrap" }}>BRZY</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRO BONO ─────────────────────────────────────────────────────── */}
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
                <button key={item} onClick={() => scrollTo(item.toLowerCase())}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "Trebuchet MS", color: "rgba(255,255,255,0.35)" }}
                  onMouseEnter={e => e.currentTarget.style.color = C.gold}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                >{item}</button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Facebook", url: "https://www.facebook.com/iveta.clarke.9" },
              { label: "LinkedIn", url: "https://www.linkedin.com/in/ivetaclarke" },
              { label: "Instagram", url: "https://www.instagram.com/ivetaclarke" },
            ].map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                padding: "8px 16px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20,
                fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Trebuchet MS", cursor: "pointer",
                textDecoration: "none", transition: "border-color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = C.gold}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)"}
              >{s.label}</a>
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
        @keyframes pointsReveal {
          from { opacity: 0; transform: translateX(-50%) scale(0.15); }
          to   { opacity: 0.9; transform: translateX(-50%) scale(1); }
        }
        @keyframes menuItemIn {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes menuLineIn {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes btnPulse {
          0%   { box-shadow: 0 0 0 0 rgba(201,168,76,0.65); }
          65%  { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
        }
        .btn-pulse { animation: btnPulse 2s ease-out infinite; }
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
