import * as pdfjs from "pdfjs-dist";

// ✅ REQUIRED for pdf.js v4 + Turbopack
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// ✅ TELL pdf.js this is an ES module
(pdfjs as any).GlobalWorkerOptions.workerType = "module";

export default pdfjs;
