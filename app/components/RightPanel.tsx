"use client";

import { PdfContentBlock } from "../types/pdf";

export default function RightPanel({
  blocks,
}: {
  blocks: PdfContentBlock[];
}) {
  return (
    <div style={{ padding: 12 }}>
      {blocks.map((b, i) => {
        if (b.type === "paragraph") {
          return (
            <p key={i}>
              <strong>Page {b.page}:</strong> {b.text}
            </p>
          );
        }

        if (b.type === "image") {
          return (
            <div key={i}>
              <strong>Page {b.page}</strong>
              <img
                src={b.src}
                style={{ maxWidth: "100%", marginTop: 8 }}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
