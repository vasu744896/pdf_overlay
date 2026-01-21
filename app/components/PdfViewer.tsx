"use client";

import { useState } from "react";
import { PdfCanvas } from "./PdfCanvas";
import { PdfTextOverlay } from "./PdfTextOverlay";
import { extractParagraphs, Paragraph } from "../utils/extractParagraphs";
import { PdfContentBlock } from "../types/pdf";

/* =========================
   HELPER: crop image region
   ========================= */
function cropRegion(
  source: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(source, x, y, width, height, 0, 0, width, height);

  return canvas.toDataURL("image/png");
}

type Props = {
  onExtracted: (blocks: PdfContentBlock[]) => void;
};

export default function PdfViewer({ onExtracted }: Props) {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  async function handleRendered({ page, viewport, scale }: any) {
    /* =========================
       TEXT EXTRACTION
       ========================= */
    const textContent = await page.getTextContent();
    const lines = extractParagraphs(textContent, viewport, scale);

    setParagraphs(lines);
    setPageSize({
      width: viewport.width,
      height: viewport.height,
    });

    const blocks: PdfContentBlock[] = [];

    /* =========================
       RENDER PAGE TO CANVAS
       ========================= */
    const imageViewport = page.getViewport({ scale: 2 });
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = imageViewport.width;
    pageCanvas.height = imageViewport.height;

    const ctx = pageCanvas.getContext("2d");
    if (!ctx) return;

    await page.render({
      canvasContext: ctx,
      viewport: imageViewport,
    }).promise;

    /* =========================
       LOGO (top-left)
       ========================= */
    blocks.push({
      type: "image",
      page: page.pageNumber,
      src: cropRegion(pageCanvas, 20, 20, 160, 160),
      width: 160,
      height: 160,
    });

    /* =========================
       PARAGRAPHS (top section)
       ========================= */
    lines.forEach((p, index) => {
      blocks.push({
        type: "paragraph",
        page: page.pageNumber,
        text: p.text,
      });

      /* =========================
         INSERT WHATSAPP ICON
         after first few lines
         ========================= */
      if (index === 3) {
        blocks.push({
          type: "image",
          page: page.pageNumber,
          src: cropRegion(
            pageCanvas,
            pageCanvas.width - 140,
            90,
            110,
            110
          ),
          width: 110,
          height: 110,
        });
      }
    });

    /* =========================
       SEND TO RIGHT PANEL
       ========================= */
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
