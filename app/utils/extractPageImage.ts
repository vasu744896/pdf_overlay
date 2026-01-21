import type { PdfImage } from "../types/pdf";

export async function extractPageImage(
  page: any,
  scale = 2
): Promise<PdfImage> {
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx, viewport }).promise;

  return {
    type: "image",
    page: page.pageNumber,
    src: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
  };
}
