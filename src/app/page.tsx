"use client";

import { setupLiff } from "@/utils/auth/liff/liff";
import { useEffect } from "react";

// According to this document, https://developers.line.biz/en/docs/liff/opening-liff-app/#redirect-flow, liff.init() should be called in `/`
// This page is only used for liff login.
// setupLiff redirects after liff.init() is called to purpose of path.
export default function LiffInitPage() {
  useEffect(() => {
    setupLiff("/home");
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mx-auto" />
        <p className="mt-4 text-lg font-semibold">
          データを読み込んでいます...
        </p>
      </div>
    </div>
  );
}
