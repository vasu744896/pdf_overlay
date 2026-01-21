export type PdfImage = {
  type: "image";
  page: number;
  src: string;      // base64
  width: number;
  height: number;
};

export type PdfParagraphBlock = {
  type: "paragraph";
  page: number;
  text: string;
};

export type PdfContentBlock = PdfParagraphBlock | PdfImage;
