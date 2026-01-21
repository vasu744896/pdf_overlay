"use client";

import dynamic from "next/dynamic";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

const PdfViewer = dynamic(() => import("./components/PdfViewer"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/6 border-r">
          <LeftPanel />
        </div>

        <div className="flex-1 flex justify-center items-center bg-gray-100">
          <PdfViewer />
        </div>

        <div className="w-1/4 border-l">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
