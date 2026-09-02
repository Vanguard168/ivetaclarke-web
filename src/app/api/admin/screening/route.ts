import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

async function verifyAdmin(req: NextRequest) {
  const jwt = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!jwt) return null;

  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${jwt}` } } }
  );
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return null;

  const db = createServerClient();
  const { data: profile } = await db.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;

  return user;
}

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

  const db = createServerClient();
  const { data, error } = await db
    .from("screening_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data });
}

export async function PATCH(req: NextRequest) {
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
}
