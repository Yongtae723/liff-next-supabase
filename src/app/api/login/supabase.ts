import type { Database } from "@/type/supabase";
import type { User } from "@/type/user";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

export async function initializeBackendSupabase(): Promise<
  SupabaseClient<Database>
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error("Supabase URL and Service Role must be defined");
  }

  return createClient(supabaseUrl, supabaseServiceRole);
}

export async function getUserByLineId(lineId: string): Promise<User | null> {
  const supabase = await initializeBackendSupabase();
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("line_id", lineId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    lineId: data.line_id,
    displayName: data.display_name,
    accountImageUrl: data.account_image_url,
    statusMessage: data.status_message,
  };
}

export async function saveUser(user: User) {
  const supabase = await initializeBackendSupabase();
  const { data, error } = await supabase
    .from("user")
    .upsert({
      id: user.id,
      line_id: user.lineId,
      display_name: user.displayName,
      account_image_url: user.accountImageUrl,
      status_message: user.statusMessage,
    })
    .select();
  return { data, error };
}
