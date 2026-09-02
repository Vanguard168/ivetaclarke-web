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
    if (profile?.role !== "admin") return null;

    return data.user;
  } catch (e) {
    console.error("verifyAdmin error:", e);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

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
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

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
