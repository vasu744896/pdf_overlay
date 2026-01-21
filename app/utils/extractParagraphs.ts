export type Paragraph = {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export function extractParagraphs(
  textContent: any,
  viewport: any,
  scale: number
): Paragraph[] {
  const lines: Paragraph[] = [];

  textContent.items.forEach((item: any) => {
    const [, , , , x, y] = item.transform;
    const top = viewport.height - y * scale;

    const last = lines[lines.length - 1];

    if (last && Math.abs(last.top - top) < 6) {
      last.text += " " + item.str;
      last.width += item.width * scale;
    } else {
      lines.push({
        text: item.str,
        left: x * scale,
        top,
        width: item.width * scale,
        height: item.height * scale || 14,
      });
    }
  });

  return lines;
}
