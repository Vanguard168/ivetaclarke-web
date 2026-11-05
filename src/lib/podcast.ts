// Zámyslník 2.0 – Moudrost je: videopodcast na YouTube.
// Sdílí ho sekce Podcast na hlavní stránce i rozcestník /links.

export type Zamyslnik2Episode = {
  /** YouTube video id (z odkazu ...watch?v=XXXX) */
  id: string;
  /** Jméno hosta */
  title: string;
  /** Datum zveřejnění ve formátu YYYY-MM-DD – podle něj se na /links rozsvítí "NOVÝ DÍL" */
  publishedAt: string;
  /**
   * Volitelně: přesný čas premiéry (ISO s offsetem, např. "2026-11-05T16:00:00+01:00").
   * Do tohoto času se na webu místo videa zobrazí "Premiéra v HH:MM" bez možnosti přehrání,
   * potom se video odemkne samo (bez nového nasazení). Po premiéře lze pole klidně nechat.
   */
  premiereAt?: string;
};

/**
 * Nejnovější díl první – ten se na webu přehrává jako výchozí
 * a podle jeho data se zvýrazňuje odkaz na /links.
 */
export const zamyslnik2Episodes: Zamyslnik2Episode[] = [
  { id: "y-6lxrUmViA", title: "Irena Budweiserová", publishedAt: "2026-11-05", premiereAt: "2026-11-05T16:00:00+01:00" },
  { id: "EmUD5uGqbQc", title: "Liběna Rochová", publishedAt: "2026-10-01" },
  { id: "80KxxlWaPRA", title: "Lucie Konášová", publishedAt: "2026-09-04" },
];

/** Jak dlouho po zveřejnění se díl na /links zvýrazňuje jako nový. */
export const NEW_EPISODE_DAYS = 14;

export const latestZamyslnik2 = zamyslnik2Episodes[0];

/** Je nejnovější díl mladší než NEW_EPISODE_DAYS? */
export function hasNewZamyslnik2(now: Date = new Date()): boolean {
  // 14 dní se počítá od premiéry (pokud je zadaná), jinak od data zveřejnění.
  const premiere = latestZamyslnik2.premiereAt ? Date.parse(latestZamyslnik2.premiereAt) : NaN;
  const published = Number.isNaN(premiere)
    ? Date.parse(`${latestZamyslnik2.publishedAt}T00:00:00Z`)
    : premiere;
  if (Number.isNaN(published)) return false;
  // "NOVÝ DÍL" se ukáže hned (i před premiérou) a drží se NEW_EPISODE_DAYS po ní.
  return now.getTime() - published < NEW_EPISODE_DAYS * 24 * 60 * 60 * 1000;
}

/** Čeká díl ještě na premiéru? (nowMs === null = ještě nevíme, kolik je hodin → bráníme se předčasnému přehrání) */
export function isPremierePending(ep: Zamyslnik2Episode, nowMs: number | null): boolean {
  if (!ep.premiereAt) return false;
  const t = Date.parse(ep.premiereAt);
  if (Number.isNaN(t)) return false;
  return nowMs === null || nowMs < t;
}

/** Text typu "Premiéra 5. 11. v 16:00" (čas v pražském pásmu). */
export function premiereLabel(ep: Zamyslnik2Episode): string {
  if (!ep.premiereAt) return "";
  const t = Date.parse(ep.premiereAt);
  if (Number.isNaN(t)) return "";
  const parts = new Intl.DateTimeFormat("cs-CZ", {
    timeZone: "Europe/Prague",
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(t));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `Premiéra ${get("day")}. ${get("month")}. v ${get("hour")}:${get("minute")}`;
}
