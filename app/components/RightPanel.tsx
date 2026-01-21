"use client";

import { PdfContentBlock } from "../types/pdf";

type RightPanelProps = {
  blocks: PdfContentBlock[];
};

export default function RightPanel({ blocks }: RightPanelProps) {
  return (
    <div className="p-3 space-y-3 overflow-y-auto">
      {blocks.map((block, index) => {
        if (block.type === "picture") {
          return (
            <div
              key={index}
              className="border rounded p-2 flex justify-center bg-white"
            >
              <img
                src={block.src}
                alt="Extracted visual"
                style={{
                  maxWidth: block.width,
                  maxHeight: block.height,
                  objectFit: "contain",
                }}
              />
            </div>
          );
        }

        if (block.type === "listgroup") {
          return (
            <div key={index} className="bg-teal-50 p-3 rounded">
              {block.items.map((item, i) => (
                <div key={i} className="text-sm leading-relaxed">
                  {item}
                </div>
              ))}
            </div>
          );
        }

        // TEXT block
        return (
          <p key={index} className="text-sm leading-relaxed">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
