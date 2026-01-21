"use client";

import { PdfContentBlock } from "../types/pdf";

export default function RightPanel({
  blocks,
}: {
  blocks: PdfContentBlock[];
}) {
  return (
    <div className="p-3 space-y-4">
      {blocks.map((b, i) => {
        if (b.type === "paragraph") {
          return (
            <p key={i} className="text-sm leading-relaxed">
              <strong>Page {b.page}:</strong> {b.text}
            </p>
          );
        }

        if (b.type === "image") {
          return (
            <div key={i} className="border rounded p-2">
              <div className="text-xs mb-1 text-gray-600">
                Image – Page {b.page}
              </div>
              <img
                src={b.src}
                alt={`Page ${b.page}`}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 4,
                }}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
