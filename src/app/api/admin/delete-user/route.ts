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
  return profile?.role === "admin" ? user : null;
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Chybí userId." }, { status: 400 });

  const db = createServerClient();

  // Delete related data first to avoid FK violations
  await db.from("screening_requests").delete().eq("user_id", userId);
  await db.from("orders").delete().eq("user_id", userId);
  await db.from("profiles").delete().eq("id", userId);

  // Delete the auth user using service role
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
