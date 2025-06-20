import { PDFDocument } from "pdf-lib";

export class PdfPage {
  id!: string;           
  pdfDoc!: PDFDocument;  
  pageIndex!: number;    
  canvasImg!: string;   
  checked: boolean =true;
}