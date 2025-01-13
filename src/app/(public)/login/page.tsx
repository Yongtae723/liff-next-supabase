"use client";

import { setupLiff } from "@/utils/auth/liff/liff";
import { loginSupabase } from "@/utils/auth/supabase";
import { useEffect, useState } from "react";

const LoginRedirect = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initializeAndRedirect = async () => {
      try {
        const redirectTo = searchParams.get("redirectTo") || "/home";
        await setupLiff(redirectTo);
        await loginSupabase();
        window.location.href = redirectTo;
      } catch (error) {
        console.error("[Login Page] Error:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    initializeAndRedirect();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mt-4 text-lg font-semibold text-red-500">
            エラーが発生しました:
            <br />
            {error}
            <br />
            お手数をおかけしますが、もしよろしければ、この画面のスクリーンショットと共に、
            <br />
            開発者にお問い合わせください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mx-auto" />
        <p className="mt-4 text-lg font-semibold">
          データを読み込んでいます...
          <br />
          時間が経っても画面が変わらない場合は
          <br />
          開発者にお問い合わせください。
        </p>
      </div>
    </div>
  );
};

export default LoginRedirect;
