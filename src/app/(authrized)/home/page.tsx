import HeaderComponent from "@/components/header";
import HomeComponent from "@/components/home";

import { fetchMe } from "@/query/user";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const user = await fetchMe(supabase);
  if (!user.accountImageUrl) {
    return <div>画像の保存に失敗しました...</div>;
  }
  return (
    <>
      <HeaderComponent imageUrl={user.accountImageUrl} />
      <HomeComponent displayName={user.displayName} />
    </>
  );
}
