import { PDFDocument } from "pdf-lib";

export interface PdfPage {
  id: string;           
  pdfDoc: PDFDocument;  
  pageIndex: number;    
  canvasImg?: string;   
  checked: boolean;
}