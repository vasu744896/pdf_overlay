export function cropRegion(
  sourceCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    sourceCanvas,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height
  );

  return canvas.toDataURL("image/png");
}
