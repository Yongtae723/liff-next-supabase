import type { User } from "@/type/user";
import type { SupabaseClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import {
  getUserByLineId,
  initializeBackendSupabase,
  saveUser,
} from "./supabase";

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  language: string;
  statusMessage?: string;
}

const verifyLineToken = async (accessToken: string): Promise<void> => {
  try {
    const channelId = process.env.LINE_CHANNEL_ID;
    const response = await fetch(
      `https://api.line.me/oauth2/v2.1/verify?access_token=${accessToken}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      const data: { error_description: string; error: string } =
        await response.json();
      throw new Error(
        `[LINE Token Verification] ${data.error}: ${data.error_description}`
      );
    }
    const data: { client_id: string; expires_in: number } =
      await response.json();
    if (data.client_id !== channelId) {
      throw new Error(
        `Line client_id does not match:liffID : ${channelId}  client_id : ${data.client_id}`
      );
    }
    if (data.expires_in < 0) {
      throw new Error(`Line access token is expired: ${data.expires_in}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`[LINE Token Verification] ${error.message}`);
    }
    throw new Error("[LINE Token Verification] Unknown error occurred");
  }
};

const getLineProfile = async (accessToken: string): Promise<LineProfile> => {
  try {
    const response = await fetch("https://api.line.me/v2/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const data: { error_description: string; error: string } =
        await response.json();
      throw new Error(
        `[LINE Profile Fetch] ${data.error}: ${data.error_description}`
      );
    }
    return response.json() as Promise<LineProfile>;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`[LINE Profile Fetch] ${error.message}`);
    }
    throw new Error("[LINE Profile Fetch] Unknown error occurred");
  }
};

const createUserObject = (profile: LineProfile, userId: string): User => ({
  id: userId,
  displayName: profile.displayName,
  lineId: profile.userId,
  accountImageUrl: profile.pictureUrl,
  statusMessage: profile.statusMessage ?? "",
});

// Create user for auth, which is not our custom user table.
async function CreateUser(
  supabase: SupabaseClient,
  profile: LineProfile
): Promise<string> {
  const { data: createdUser, error: createError } =
    await supabase.auth.admin.createUser({
      email: `${profile.userId}@line.com`,
      email_confirm: true,
      password: profile.userId,
      user_metadata: {
        line_id: profile.userId,
        display_name: profile.displayName,
        picture_url: profile.pictureUrl,
        language: profile.language,
        status_message: profile.statusMessage,
      },
      app_metadata: { provider: "line" },
    });

  if (createError || !createdUser?.user) {
    throw new Error("Failed to create user");
  }

  const user = createUserObject(profile, createdUser.user.id);
  const { error: saveError } = await saveUser(user);
  if (saveError) throw new Error(`[User Save] ${saveError.message}`);

  return createdUser.user.id;
}

const getMockProfile = (): LineProfile => ({
  userId: "U0000001",
  displayName: "U0000001",
  pictureUrl: "https://placehold.jp/10cb52/ffffff/150x150.png?text=U0000001",
  language: "ja",
  statusMessage: "This is the test profile",
});

export const POST = async (req: NextRequest) => {
  try {
    const supabase = await initializeBackendSupabase();
    const { accessToken } = (await req.json()) as { accessToken: string };

    let profile: LineProfile;

    if (process.env.NODE_ENV === "development") {
      profile = getMockProfile();
    } else {
      await verifyLineToken(accessToken);
      profile = await getLineProfile(accessToken);
    }

    const userData = await getUserByLineId(profile.userId);

    if (!userData) {
      await CreateUser(supabase, profile);
    }

    // following auth code is simple signInWithPassword for sample code.
    // Please replace method when you use production.
    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: `${profile.userId}@line.com`,
        password: profile.userId,
      });

    if (signInError) throw new Error(`[Auth Sign In] ${signInError.message}`);

    return NextResponse.json({
      sessionToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
};
