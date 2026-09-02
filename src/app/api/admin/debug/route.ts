import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const jwt = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!jwt) return NextResponse.json({ error: "No JWT in Authorization header" });

  // 1. Verify JWT via anon key
  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${jwt}` } } }
  );
  const { data: { user }, error: authError } = await userClient.auth.getUser();

  if (!user) return NextResponse.json({ error: "JWT invalid or expired", authError });

  // 2. Fetch profile via service role
  const db = createServerClient();
  const { data: profile, error: profileError } = await db
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    user_id: user.id,
    user_email: user.email,
    profile,
    profileError: profileError?.message ?? null,
    role: profile?.role ?? null,
    is_admin: profile?.role === "admin",
  });
}
