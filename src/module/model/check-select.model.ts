import { PDFDocument } from "pdf-lib";

export class CheckSelectModelPagePDF {
  pageNumber: number = -1;
  viewport: any = null;
  context: CanvasRenderingContext2D | null = null;
  page: any = null;
  checked: boolean = false;
}
export interface PdfPage {
  id: string;           // id único para identificar a página
  pdfDoc: PDFDocument;  // Documento PDF da página (pdf-lib)
  pageIndex: number;    // índice da página no documento original
  canvasImg?: string;   // preview em base64 da página renderizada
  checked: boolean;
}