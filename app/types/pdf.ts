export type PdfTextBlock = {
  type: "text";
  page: number;
  text: string;
};

export type PdfPictureBlock = {
  type: "picture";
  page: number;
  src: string;
  width: number;
  height: number;
};

export type PdfListGroupBlock = {
  type: "listgroup";
  page: number;
  items: string[];
};

export type PdfContentBlock =
  | PdfTextBlock
  | PdfPictureBlock
  | PdfListGroupBlock;
