import { PdfContentBlock } from "../types/pdf";

const isListItem = (text: string) =>
  /^\s*(\d+[\).\]]|[-•])\s+/.test(text);

const isHeading = (text: string) =>
  /^[A-Z\s]{4,}$/.test(text.trim());

export function buildListGroups(
  blocks: PdfContentBlock[]
): PdfContentBlock[] {
  const result: PdfContentBlock[] = [];

  let listBuffer: string[] = [];
  let currentPage: number | null = null;

  const flushList = () => {
    if (listBuffer.length && currentPage !== null) {
      result.push({
        type: "listgroup",
        page: currentPage,
        items: [...listBuffer],
      });
      listBuffer = [];
      currentPage = null;
    }
  };

  for (const block of blocks) {
    if (block.type !== "text") {
      flushList();
      result.push(block);
      continue;
    }

    const text = block.text.trim();

    // Heading → close list, keep as TEXT
    if (isHeading(text)) {
      flushList();
      result.push(block);
      continue;
    }

    // List item
    if (isListItem(text)) {
      if (listBuffer.length === 0) {
        currentPage = block.page;
      }
      listBuffer.push(
        text.replace(/^\s*(\d+[\).\]]|[-•])\s+/, "")
      );
      continue;
    }

    // Normal paragraph
    flushList();
    result.push(block);
  }

  flushList();
  return result;
}
