import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Supabase URL must be defined");
  }

  if (!supabaseAnonKey) {
    throw new Error("Supabase Anon Key must be defined");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
