"use client";

import { useState } from "react";
import { PdfCanvas } from "./PdfCanvas";
import { PdfTextOverlay } from "./PdfTextOverlay";
import { extractParagraphs, Paragraph } from "../utils/extractParagraphs";

export default function PdfViewer() {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  async function handleRendered({ page, viewport, scale }: any) {
    const textContent = await page.getTextContent();
    const lines = extractParagraphs(textContent, viewport, scale);

    setParagraphs(lines);
    setPageSize({
      width: viewport.width,
      height: viewport.height,
    });
  }

  return (
    <div
      style={{
        height: "80vh",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      }}
    >
      <div
        className="relative inline-block"
        style={{
          width: pageSize.width,
          height: pageSize.height,
        }}
      >
        <PdfCanvas onRendered={handleRendered} />
        <PdfTextOverlay
          paragraphs={paragraphs}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
