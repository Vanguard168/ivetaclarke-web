import { createServerClient } from "./supabase-server";

/**
 * Záznam o pokusu odeslat e-mail k dané registraci.
 * Zapisuje se do tabulky email_log (viz migrace v README/chatu).
 *
 * Logování nesmí NIKDY shodit odesílání ani samotnou registraci – když
 * tabulka chybí nebo zápis selže, jen se to zaloguje do konzole.
 */
export type EmailKind =
  | "consultation"   // potvrzení konzultace zákazníkovi (Calendly)
  | "payment_link"   // platební odkaz zákazníkovi
  | "admin_notify";  // upozornění adminům

const KIND_LABELS: Record<EmailKind, string> = {
  consultation: "Potvrzení konzultace (Calendly)",
  payment_link: "Platební odkaz",
  admin_notify: "Upozornění adminům",
};

export function emailKindLabel(kind: string): string {
  return KIND_LABELS[kind as EmailKind] ?? kind;
}

export async function logEmail(entry: {
  screeningRequestId?: string | null;
  kind: EmailKind;
  recipient: string;
  error?: string | null;
}) {
  try {
    const db = createServerClient();
    const { error } = await db.from("email_log").insert({
      screening_request_id: entry.screeningRequestId ?? null,
      kind: entry.kind,
      recipient: entry.recipient,
      status: entry.error ? "error" : "sent",
      error: entry.error ?? null,
    });
    if (error) console.error("email_log insert failed:", error.message);
  } catch (e) {
    console.error("email_log insert crashed:", e instanceof Error ? e.message : e);
  }
}
