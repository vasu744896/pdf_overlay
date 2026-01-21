export type PdfParagraph = {
  type: "paragraph";
  page: number;
  text: string;
};

export type PdfImage = {
  type: "image";
  page: number;
  src: string; // base64
  width: number;
  height: number;
};

export type PdfContentBlock = PdfParagraph | PdfImage;
