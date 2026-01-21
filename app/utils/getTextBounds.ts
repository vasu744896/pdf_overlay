export type TextBox = {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export function getTextBoxes(
  items: any[],
  viewportHeight: number,
  scale: number
): TextBox[] {
  return items
    .filter((i) => typeof i.str === "string" && i.str.trim())
    .map((i) => {
      const [a, b, c, d, x, y] = i.transform;
      return {
        text: i.str,
        left: x * scale,
        top: viewportHeight - y * scale,
        width: (i.width || i.str.length * 6) * scale,
        height: (i.height || 12) * scale,
      };
    });
}
