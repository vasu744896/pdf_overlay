export function findAnchorY(
  items: any[],
  keyword: string,
  viewportHeight: number,
  scale: number
): number | null {
  for (const item of items) {
    if (
      typeof item.str === "string" &&
      item.str.toLowerCase().includes(keyword.toLowerCase())
    ) {
      const [, , , , , y] = item.transform;
      return viewportHeight - y * scale;
    }
  }
  return null;
}
