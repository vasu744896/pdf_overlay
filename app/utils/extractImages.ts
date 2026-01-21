import type { PdfImage } from "../types/pdf";
import pdfjs from "../lib/pdfWorker";

export async function extractImages(page: any): Promise<PdfImage[]> {
  const ops = await page.getOperatorList();
  const images: PdfImage[] = [];

  for (let i = 0; i < ops.fnArray.length; i++) {
    if (ops.fnArray[i] === pdfjs.OPS.paintImageXObject) {
      const imgName = ops.argsArray[i][0];
      const img = await page.objs.get(imgName);

      if (!img || !img.data) continue;

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      const imageData = ctx.createImageData(img.width, img.height);
      imageData.data.set(img.data);
      ctx.putImageData(imageData, 0, 0);

      images.push({
        type: "image",
        page: page.pageNumber,
        src: canvas.toDataURL("image/png"),
        width: img.width,
        height: img.height,
      });
    }
  }

  return images;
}
