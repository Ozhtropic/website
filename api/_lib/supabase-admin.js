import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

let supabaseAdmin;

export function getSupabaseAdmin() {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error("Supabase server credentials are missing.");
  }

  supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}

