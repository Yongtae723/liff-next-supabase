import type { Database } from "@/type/supabase";
import type { User } from "@/type/user";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchMe(
  supabase: SupabaseClient<Database>
): Promise<User> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser?.id) {
    throw new Error("ユーザーが見つかりませんでした");
  }
  console.log("authUser", authUser.id);

  const { data, error } = await supabase
    .from("user")
    .select(
      `
      id,
      line_id,
      display_name,
      account_image_url,
      status_message
    `
    )
    .eq("id", authUser?.id)
    .single();

  if (error) {
    console.error("ユーザーの取得中にエラーが発生しました:", error);
    throw new Error("ユーザーの取得に失敗しました");
  }

  if (!data) {
    throw new Error("ユーザーが見つかりませんでした");
  }

  const user: User = {
    id: data.id,
    lineId: data.line_id,
    displayName: data.display_name,
    accountImageUrl: data.account_image_url,
    statusMessage: data.status_message,
  };

  return user;
}
