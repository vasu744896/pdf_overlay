import { TextBox } from "./getTextBounds";

export function findAnchorBox(
  boxes: TextBox[],
  matcher: (text: string) => boolean
): TextBox | null {
  for (const box of boxes) {
    if (matcher(box.text)) {
      return box;
    }
  }
  return null;
}
