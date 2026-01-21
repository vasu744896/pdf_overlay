"use client";

import { useEffect, useRef } from "react";
import pdfjs from "../lib/pdfWorker";

type Props = {
  onRendered: (data: {
    page: any;
    viewport: any;
    scale: number;
  }) => void;
};

export function PdfCanvas({ onRendered }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const mountedRef = useRef(true);
  const renderedOnceRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    // 🔒 Prevent double render in React StrictMode
    if (renderedOnceRef.current) return;
    renderedOnceRef.current = true;

    async function renderPdf() {
      try {
        const pdf = await pdfjs.getDocument("/sample.pdf").promise;
        if (!mountedRef.current) return;

        const page = await pdf.getPage(1);
        if (!mountedRef.current) return;

        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const task = page.render({ canvasContext: ctx, viewport } as any);
        renderTaskRef.current = task;

        await task.promise;

        if (!mountedRef.current) return;

        onRendered({ page, viewport, scale });
      } catch (err: any) {
        // ✅ THIS IS THE KEY LINE
        if (err?.name === "RenderingCancelledException") {
          return; // silently ignore
        }
        console.error(err);
      }
    }

    renderPdf();

    return () => {
      mountedRef.current = false;
      renderTaskRef.current?.cancel();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
