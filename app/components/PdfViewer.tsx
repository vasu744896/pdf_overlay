"use client";

import { useEffect, useRef, useState } from "react";
import pdfjs from "../lib/pdfWorker";

type Paragraph = {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export default function PdfViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadPdf() {
      const pdf = await pdfjs.getDocument("/sample.pdf").promise;
      const page = await pdf.getPage(1);

      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setPageSize({ width: viewport.width, height: viewport.height });

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const task = page.render({ canvasContext: ctx, viewport } as any);
      renderTaskRef.current = task;

      try {
        await task.promise;
      } catch (err: any) {
        if (err?.name === "RenderingCancelledException") return;
        console.error(err);
        return;
      }

      const textContent = await page.getTextContent();

      /* -------------------------------
         GROUP WORDS → PARAGRAPHS
      -------------------------------- */
      const lines: any[] = [];

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

      setParagraphs(lines);
    }

    loadPdf();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, []);

  return (
    <div className="relative inline-block bg-white shadow">
      {/* PDF IMAGE */}
      <canvas ref={canvasRef} />

      {/* PARAGRAPH OVERLAY */}
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
                  ? "rgba(0, 120, 255, 0.25)"
                  : "transparent",
              cursor: "text",
            }}
          />
        ))}
      </div>
    </div>
  );
}
