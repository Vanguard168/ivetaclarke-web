// Zámyslník 2.0 – Moudrost je: videopodcast na YouTube.
// Sdílí ho sekce Podcast na hlavní stránce i rozcestník /links.

export type Zamyslnik2Episode = {
  /** YouTube video id (z odkazu ...watch?v=XXXX) */
  id: string;
  /** Jméno hosta */
  title: string;
  /** Datum zveřejnění ve formátu YYYY-MM-DD – podle něj se na /links rozsvítí "NOVÝ DÍL" */
  publishedAt: string;
};

/**
 * Nejnovější díl první – ten se na webu přehrává jako výchozí
 * a podle jeho data se zvýrazňuje odkaz na /links.
 */
export const zamyslnik2Episodes: Zamyslnik2Episode[] = [
  { id: "EmUD5uGqbQc", title: "Liběna Rochová", publishedAt: "2026-10-01" },
  { id: "80KxxlWaPRA", title: "Lucie Konášová", publishedAt: "2026-09-04" },
];

/** Jak dlouho po zveřejnění se díl na /links zvýrazňuje jako nový. */
export const NEW_EPISODE_DAYS = 14;

export const latestZamyslnik2 = zamyslnik2Episodes[0];

/** Je nejnovější díl mladší než NEW_EPISODE_DAYS? */
export function hasNewZamyslnik2(now: Date = new Date()): boolean {
  const published = Date.parse(`${latestZamyslnik2.publishedAt}T00:00:00Z`);
  if (Number.isNaN(published)) return false;
  return now.getTime() - published < NEW_EPISODE_DAYS * 24 * 60 * 60 * 1000;
}
