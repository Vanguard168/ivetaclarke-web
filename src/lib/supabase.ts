import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  company?: string;
  ico?: string;
  role?: string;
};

export type Order = {
  id: string;
  user_id: string;
  package_id: string;
  package_title: string;
  price_czk: number;
  price_display: string;
  comgate_trans_id?: string;
  comgate_ref_id: string;
  status: "PENDING" | "PAID" | "CANCEL_REQUESTED" | "CANCELLED";
  created_at: string;
  paid_at?: string;
};
