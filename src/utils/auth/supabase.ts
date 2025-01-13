"use client";

import liff from "@line/liff";

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const handleSupabaseLogin = async (
  sessionToken: string,
  refreshToken: string
): Promise<void> => {
  try {
    await supabase.auth.setSession({
      access_token: sessionToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    throw new Error(`Failed to set Supabase session: ${String(error)}`);
  }
};

const fetchSessionFromServer = async (
  accessToken: string
): Promise<{ sessionToken: string; refreshToken: string }> => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { error: string };
    throw new Error(`Server login failed: ${errorData.error}`);
  }

  return (await response.json()) as {
    sessionToken: string;
    refreshToken: string;
  };
};

export const loginSupabase = async (): Promise<void> => {
  const lineAccessToken = liff.getAccessToken();
  if (!lineAccessToken) {
    throw new Error("LINE access token not available");
  }
  const { sessionToken, refreshToken } =
    await fetchSessionFromServer(lineAccessToken);
  await handleSupabaseLogin(sessionToken, refreshToken);
};
