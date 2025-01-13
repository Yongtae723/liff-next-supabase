"use client";

import liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";
import type { MockData } from "@line/liff-mock/dist/store/MockDataStore";

import {
	getMockProfile,
	getMockScanCodeResult,
} from "@/utils/auth/liff/liff_mock";
// Constants
const TEST_USER_ID = "U0000001";
const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID as string;

if (!LIFF_ID) {
	throw new Error("LIFF_ID is not set");
}

const setupMockLiff = async (): Promise<void> => {
	liff.use(new LiffMockPlugin());
	await liff.init({
		liffId: LIFF_ID,
		// @ts-expect-error: mock property is provided by LiffMockPlugin
		mock: true,
	});

	// @ts-expect-error: $mock property is provided by LiffMockPlugin
	liff.$mock.set((data: Partial<MockData>) => ({
		...data,
		isInClient: true,
		getProfile: getMockProfile(TEST_USER_ID),
		scanCode: getMockScanCodeResult(TEST_USER_ID),
	}));
};

export async function setupLiff(redirectTo: string): Promise<void> {
	await (process.env.NODE_ENV === "development"
		? setupMockLiff()
		: liff.init({ liffId: LIFF_ID }));

	// following codes are ignored when web is used from liff app.
	if (!liff.isLoggedIn()) {
		const redirectUri = new URL(redirectTo, window.location.origin).href;
		liff.login({ redirectUri });
		return;
	}
}
