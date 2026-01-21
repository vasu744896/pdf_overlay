"use client";

import { useState } from "react";
import { Paragraph } from "../utils/extractParagraphs";

type Props = {
  paragraphs: Paragraph[];
  pageSize: { width: number; height: number };
};

export function PdfTextOverlay({ paragraphs, pageSize }: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div
      className="absolute top-0 left-0"
      style={{
        width: pageSize.width,
        height: pageSize.height,
      }}
    >
      {paragraphs.map((p, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height + 6,
            background:
              hoverIndex === i
                ? "rgba(0,120,255,0.25)"
                : "transparent",
            cursor: "text",
          }}
        />
      ))}
    </div>
  );
}
