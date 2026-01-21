"use client";

import { useState, useEffect } from "react";
import { PdfCanvas } from "./PdfCanvas";
import { PdfTextOverlay } from "./PdfTextOverlay";
import { extractParagraphs, Paragraph } from "../utils/extractParagraphs";
import { PdfContentBlock } from "../types/pdf";

type Props = {
  onExtracted: (blocks: PdfContentBlock[]) => void;
};

export default function PdfViewer({ onExtracted }: Props) {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  async function handleRendered({ page, viewport, scale }: any) {
    // 1️⃣ Extract raw text
    const textContent = await page.getTextContent();

    // 2️⃣ Group into paragraphs (existing logic)
    const lines = extractParagraphs(textContent, viewport, scale);

    // 3️⃣ Update overlay state (LEFT SIDE)
    setParagraphs(lines);
    setPageSize({
      width: viewport.width,
      height: viewport.height,
    });

    // 4️⃣ Convert to RIGHT PANEL format
    const blocks: PdfContentBlock[] = lines.map((p) => ({
      type: "paragraph",
      page: page.pageNumber,
      text: p.text,
    }));

    // 5️⃣ Send extracted data UP
    onExtracted(blocks);
  }

  return (
    <div
      style={{
        height: "80vh",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#ffffff",
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
        {/* PDF CANVAS */}
        <PdfCanvas onRendered={handleRendered} />

        {/* TEXT OVERLAY */}
        <PdfTextOverlay
          paragraphs={paragraphs}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
