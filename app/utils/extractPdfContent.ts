import type { PdfContentBlock } from "../types/pdf";
import { extractParagraphs } from "./extractParagraphs";
import { extractImages } from "./extractImages";

export async function extractPdfContent(pdf: any): Promise<PdfContentBlock[]> {
  const blocks: PdfContentBlock[] = [];

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);

    // TEXT
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });
    const paragraphs = extractParagraphs(textContent, viewport, 1);

    paragraphs.forEach((p) => {
      blocks.push({
        type: "paragraph",
        page: pageNo,
        text: p.text,
      });
    });

    // IMAGES
    const images = await extractImages(page);
    blocks.push(...images);
  }

  return blocks;
}
