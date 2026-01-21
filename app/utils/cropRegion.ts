export function cropRegion(
  source: HTMLCanvasElement,
  x: number,
  y: number,
  w: number,
  h: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(source, x, y, w, h, 0, 0, w, h);

  return canvas.toDataURL("image/png");
}
