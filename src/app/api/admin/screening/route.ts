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
    return NextResponse.json({ requests: data ?? [] });
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

    const { id, admin_notes, status } = await req.json();
    if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });

    const db = createServerClient();
    const update: Record<string, string> = {};
    if (admin_notes !== undefined) update.admin_notes = admin_notes;
    if (status !== undefined) update.status = status;

    const { error } = await db.from("screening_requests").update(update).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Server crash: ${msg}` }, { status: 500 });
  }
}
