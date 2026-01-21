export function cropRelative(
  canvas: HTMLCanvasElement,
  anchor: { left: number; top: number; width: number; height: number },
  direction: "left" | "right" | "above" | "below",
  padding = 10,
  size = 80
): string {
  let x = anchor.left;
  let y = anchor.top;

  if (direction === "left") {
    x = anchor.left - size - padding;
  } else if (direction === "right") {
    x = anchor.left + anchor.width + padding;
  } else if (direction === "above") {
    y = anchor.top - size - padding;
  } else if (direction === "below") {
    y = anchor.top + anchor.height + padding;
  }

  x = Math.max(0, x);
  y = Math.max(0, y);

  const crop = document.createElement("canvas");
  crop.width = size;
  crop.height = size;

  const ctx = crop.getContext("2d")!;
  ctx.drawImage(canvas, x, y, size, size, 0, 0, size, size);

  return crop.toDataURL("image/png");
}
