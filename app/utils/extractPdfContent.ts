import type { PdfContentBlock } from "../types/pdf";
import { extractParagraphs } from "./extractParagraphs";

/**
 * Extract FULL PDF content:
 * - Paragraph text (structured)
 * - Full-page image (guaranteed to show all visuals)
 */
export async function extractPdfContent(pdf: any): Promise<PdfContentBlock[]> {
  const blocks: PdfContentBlock[] = [];

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);

    /* =========================
       TEXT EXTRACTION
       ========================= */
    const textContent = await page.getTextContent();
    const textViewport = page.getViewport({ scale: 1 });

    const paragraphs = extractParagraphs(
      textContent,
      textViewport,
      1
    );

    paragraphs.forEach((p) => {
      blocks.push({
        type: "paragraph",
        page: pageNo,
        text: p.text,
      });
    });

    /* =========================
       IMAGE EXTRACTION (PAGE SNAPSHOT)
       ========================= */
    const imageViewport = page.getViewport({ scale: 2 }); // higher clarity

    const canvas = document.createElement("canvas");
    canvas.width = imageViewport.width;
    canvas.height = imageViewport.height;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      await page.render({
        canvasContext: ctx,
        viewport: imageViewport,
      }).promise;

      blocks.push({
        type: "image",
        page: pageNo,
        src: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height,
      });
    }
  }

  return blocks;
}
