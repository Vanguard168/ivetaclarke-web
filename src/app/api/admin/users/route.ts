import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

async function verifyAdmin(req: NextRequest) {
  try {
    const jwt = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!jwt) return null;
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    );
    const { data } = await userClient.auth.getUser();
    if (!data?.user) return null;
    const db = createServerClient();
    const { data: profile } = await db.from("profiles").select("role").eq("id", data.user.id).single();
    return profile?.role === "admin" ? data.user : null;
  } catch { return null; }
}

/**
 * Registrovaní uživatelé (účty). Je to něco jiného než /api/admin/screening –
 * tam jsou jen vyplněné dotazníky. Kdo si založí účet a dotazník nevyplní,
 * je vidět jen tady.
 */
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

  const db = createServerClient();

  const { data: profiles, error } = await db
    .from("profiles")
    .select("id, first_name, last_name, phone, street, city, zip, company, ico, role, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // E-mail není v profiles, žije v auth.users
  const emails: Record<string, string> = {};
  try {
    const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
    for (const u of list?.users ?? []) if (u.email) emails[u.id] = u.email;
  } catch (e) {
    console.error("listUsers failed:", e instanceof Error ? e.message : e);
  }

  // Kdo z nich už vyplnil dotazník – ať je poznat, koho dohánět
  const { data: reqs } = await db.from("screening_requests").select("user_id");
  const withRequest = new Set((reqs ?? []).map(r => r.user_id).filter(Boolean));

  const users = (profiles ?? []).map(p => ({
    ...p,
    email: emails[p.id] ?? null,
    has_request: withRequest.has(p.id),
  }));

  return NextResponse.json({ users });
}

/**
 * Založí kartu zákazníka (screening_requests) uživateli, který si jen
 * vytvořil účet a dotazník nevyplnil. Díky tomu se dá použít stejná
 * administrace jako u ostatních — fakturační údaje, platební odkaz, stavy.
 * Když už kartu má, vrátí tu stávající, aby nevznikaly duplicity.
 */
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Chybí userId." }, { status: 400 });

  const db = createServerClient();

  const { data: existing } = await db
    .from("screening_requests")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return NextResponse.json({ ok: true, id: existing.id, created: false });

  const { data: profile } = await db
    .from("profiles")
    .select("first_name, last_name, phone, street, city, zip")
    .eq("id", userId)
    .single();

  let email: string | null = null;
  try {
    const { data } = await db.auth.admin.getUserById(userId);
    email = data?.user?.email ?? null;
  } catch { /* e-mail dohledáme níž jako prázdný */ }

  if (!email) return NextResponse.json({ error: "U účtu se nepodařilo zjistit e-mail." }, { status: 400 });

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || email;

  const { data: created, error } = await db
    .from("screening_requests")
    .insert({
      user_id: userId,
      user_email: email,
      user_name: name,
      phone: profile?.phone ?? null,
      street: profile?.street ?? null,
      city: profile?.city ?? null,
      zip: profile?.zip ?? null,
      screening_type: "consultation",
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Create request from account failed:", error);
    return NextResponse.json({ error: "Kartu se nepodařilo založit." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: created.id, created: true });
}
