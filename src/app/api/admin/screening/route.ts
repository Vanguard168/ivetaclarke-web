import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

async function verifyAdmin(req: NextRequest): Promise<{ user: ReturnType<typeof Object.create>; error?: never } | { user?: never; error: string }> {
  try {
    const jwt = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!jwt) return { error: "no_jwt" };

    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    );
    const { data, error: authErr } = await userClient.auth.getUser();
    if (!data?.user) return { error: `jwt_invalid: ${authErr?.message}` };

    const db = createServerClient();
    const { data: profile, error: profileErr } = await db
      .from("profiles").select("role").eq("id", data.user.id).single();

    if (profileErr) return { error: `profile_error: ${profileErr.message}` };
    if (!profile) return { error: `no_profile_for_${data.user.id}` };
    if (profile.role !== "admin") return { error: `role_is_${profile.role ?? "null"}_not_admin` };

    return { user: data.user };
  } catch (e) {
    return { error: `exception: ${e}` };
  }
}

export async function GET(req: NextRequest) {
  try {
    const result = await verifyAdmin(req);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 403 });

    const db = createServerClient();
    const { data, error } = await db
      .from("screening_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Přibal profil zákazníka – admin z něj předvyplňuje fakturační údaje.
    const rows = data ?? [];
    const userIds = Array.from(new Set(rows.map(r => r.user_id).filter(Boolean))) as string[];
    let profiles: Record<string, Record<string, unknown>> = {};
    if (userIds.length) {
      const { data: profs } = await db
        .from("profiles")
        .select("id, first_name, last_name, phone, street, city, zip, company, ico")
        .in("id", userIds);
      profiles = Object.fromEntries((profs ?? []).map(pr => [pr.id as string, pr]));
    }

    const requests = rows.map(r => ({
      ...r,
      profile: r.user_id ? profiles[r.user_id] ?? null : null,
    }));

    return NextResponse.json({ requests });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Admin GET crash:", msg);
    return NextResponse.json({ error: `Server crash: ${msg}` }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const result = await verifyAdmin(req);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 403 });

    const { id, new_note, status, billing } = await req.json();
    if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });

    const db = createServerClient();
    const update: Record<string, unknown> = {};

    if (new_note !== undefined) {
      // Load existing notes, prepend new entry with timestamp
      const { data: row } = await db.from("screening_requests").select("admin_notes").eq("id", id).single();
      let existing: { text: string; created_at: string }[] = [];
      if (row?.admin_notes) {
        try { existing = JSON.parse(row.admin_notes); } catch { existing = []; }
      }
      const entry = { text: new_note, created_at: new Date().toISOString() };
      update.admin_notes = JSON.stringify([entry, ...existing]);
    }
    if (status !== undefined) update.status = status;

    if (billing !== undefined) {
      update.billing_name = billing?.name ?? null;
      update.billing_street = billing?.street ?? null;
      update.billing_city = billing?.city ?? null;
      update.billing_zip = billing?.zip ?? null;
      update.billing_company = billing?.company ?? null;
      update.billing_ico = billing?.ico ?? null;
    }

    const { error } = await db.from("screening_requests").update(update).eq("id", id);

    if (error) {
      // Tady nemá smysl tiše pokračovat – uložení fakturačních údajů je celý smysl akce.
      if (billing !== undefined && isMissingColumn(error)) {
        return NextResponse.json({
          error: "V tabulce screening_requests chybí sloupce billing_*. Spusťte prosím migraci (viz nápověda u sekce Fakturační údaje).",
        }, { status: 500 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Server crash: ${msg}` }, { status: 500 });
  }
}

/** Update spadl kvůli sloupci, který v tabulce zatím není. */
function isMissingColumn(e: { code?: string; message?: string }): boolean {
  if (e?.code === "PGRST204" || e?.code === "42703") return true;
  return /column .* does not exist|could not find the '.*' column/i.test(e?.message ?? "");
}
