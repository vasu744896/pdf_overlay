"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import { PdfContentBlock } from "./types/pdf";

const PdfViewer = dynamic(() => import("./components/PdfViewer"), {
  ssr: false,
});

export default function Page() {
  // ✅ Central state
  const [blocks, setBlocks] = useState<PdfContentBlock[]>([]);

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/6 border-r">
          <LeftPanel />
        </div>

        <div className="flex-1 flex justify-center items-center bg-gray-100">
          {/* ⬇ Pass setter DOWN */}
          <PdfViewer onExtracted={setBlocks} />
        </div>

        <div className="w-1/4 border-l overflow-y-auto">
          {/* ⬇ Pass data IN */}
          <RightPanel blocks={blocks} />
        </div>
      </div>
    </div>
  );
}
