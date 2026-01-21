"use client";

import { useState } from "react";
import { PdfCanvas } from "./PdfCanvas";
import { PdfTextOverlay } from "./PdfTextOverlay";
import { extractParagraphs, Paragraph } from "../utils/extractParagraphs";
import { PdfContentBlock } from "../types/pdf";
import { getTextBoxes } from "../utils/getTextBounds";
import { findAnchorBox } from "../utils/findAnchorBox";
import { cropRelative } from "../utils/cropRelative";
import { buildListGroups } from "../utils/buildListGroups";

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
    const items = textContent.items;

    const lines = extractParagraphs(textContent, viewport, scale);
    setParagraphs(lines);
    setPageSize({ width: viewport.width, height: viewport.height });

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
       TEXT BOXES (GEOMETRY)
       ========================= */
    const boxes = getTextBoxes(items, viewport.height, scale);

    /* =========================
       FIND ANCHORS (NO HARDCODE)
       ========================= */
    const header = findAnchorBox(boxes, (t) =>
      t.toLowerCase().includes("interview")
    );
    const phone = findAnchorBox(boxes, (t) => t.includes("+91"));
    const mail = findAnchorBox(boxes, (t) => t.includes("@"));

    /* =========================
       BUILD RAW BLOCKS
       ========================= */
    const rawBlocks: PdfContentBlock[] = [];

    // Logo near header
    if (header) {
      rawBlocks.push({
        type: "picture",
        page: page.pageNumber,
        src: cropRelative(pageCanvas, header, "left"),
        width: 80,
        height: 80,
      });
    }

    // Text blocks (document flow)
    lines.forEach((p) => {
      rawBlocks.push({
        type: "text",
        page: page.pageNumber,
        text: p.text,
      });
    });

    // Phone icon
    if (phone) {
      rawBlocks.push({
        type: "picture",
        page: page.pageNumber,
        src: cropRelative(pageCanvas, phone, "left"),
        width: 60,
        height: 60,
      });
    }

    // Mail icon
    if (mail) {
      rawBlocks.push({
        type: "picture",
        page: page.pageNumber,
        src: cropRelative(pageCanvas, mail, "left"),
        width: 60,
        height: 60,
      });
    }

    /* =========================
       AUTO-DETECT LISTGROUP
       ========================= */
    const finalBlocks = buildListGroups(rawBlocks);

    /* =========================
       SEND TO RIGHT PANEL
       ========================= */
    onExtracted(finalBlocks);
  }

  return (
    <div style={{ height: "80vh", overflowY: "auto" }}>
      <div
        className="relative inline-block"
        style={{
          width: pageSize.width,
          height: pageSize.height,
        }}
      >
        <PdfCanvas onRendered={handleRendered} />
        <PdfTextOverlay paragraphs={paragraphs} pageSize={pageSize} />
      </div>
    </div>
  );
}
