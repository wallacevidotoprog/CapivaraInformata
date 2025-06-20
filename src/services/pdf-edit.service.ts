import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { PdfPage } from '../module/model/check-select.model';
const pdfWorker = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
);
pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.mjs';

export class PdfEdit {
  constructor() {
    this.pages = [];
  }
  protected pages: PdfPage[] = [];

  public getPages(): PdfPage[] {
    return this.pages;
  }

  public async onFileChange(event: any): Promise<PdfPage[]> {
    const files: FileList = event.target.files;
    if (!files.length) {
      throw new Error('Não existe arquivo', { cause: files });
    }

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();

        const pdfDoc = await PDFDocument.load(arrayBuffer);

        const pdfjsDoc = await pdfjsLib.getDocument({
          data: arrayBuffer,
        }).promise;

        for (let pageNum = 1; pageNum <= pdfjsDoc.numPages; pageNum++) {
          const page = await pdfjsDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d')!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;

          const canvasImg = canvas.toDataURL();

          this.pages.push({
            id: `${file.name}-page-${pageNum}-${Date.now()}`,
            pdfDoc,
            pageIndex: pageNum - 1,
            canvasImg,
            checked: true,
          });
        }
      }
      return this.pages;
    } catch (error) {
      throw new Error('Erro ao ler arquivo', { cause: error });
    }
  }

  public async downloadFullPDF() {
    const novoPdf = await PDFDocument.create();

    for (const page of this.pages) {
      if (page.checked) {
        const [copiedPage] = await novoPdf.copyPages(page.pdfDoc, [
          page.pageIndex,
        ]);
        novoPdf.addPage(copiedPage);
      }
    }

    const pdfBytes = await novoPdf.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: 'application/pdf',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arquivo-mesclado.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  public async downloadSeparatePDF() {
    const zip = new JSZip();
    const pdfFolder = zip.folder('pdfs');
    let index: number = 0;
    for (const page of this.pages) {
      if (page.checked) {
        const novoPdf = await PDFDocument.create();
        const [copiedPage] = await novoPdf.copyPages(page.pdfDoc, [
          page.pageIndex,
        ]);
        novoPdf.addPage(copiedPage);

        const pdfBytes = await novoPdf.save();
        const filename = `${index} - capivara-pdf--pagina-${page.id.substring(
          0,
          page.id.indexOf('.pdf')
        )}.pdf`;

        pdfFolder!.file(filename, pdfBytes);
        index++;
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'paginas-separadas.zip');
  }
  public clearFile() {
    this.pages = [];
  }

  public dragDrop(event: CdkDragDrop<PdfPage[]>) {
    moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
  }

  public pdfChangeAction(id: string) {
    const index = this.pages.findIndex((page) => page.id === id);
    this.pages[index].checked = !this.pages[index].checked;
  }

  public async pdfToImage() {
    const zip = new JSZip();
    const imgFolder = zip.folder('pdf-images');

    let index: number = 0;
    for (const page of this.pages) {
      if (page.checked) {
        const base64Data = page.canvasImg.split(',')[1];
        imgFolder!.file(
          `${index} - capivara-pdf--pagina- ${page.id.substring(
            0,
            page.id.indexOf('.pdf')
          )}.png`,
          base64Data,
          { base64: true }
        );
        index++;
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'pdf-pages.zip');
  }

  public async pdfToXlsx() {
    const data = await this.extractTextData();
    this.exportToExcel(data);
  }

  public async extractTextData(): Promise<string[][]> {
    const rows: string[][] = [];

    for (const page of this.pages) {
      if (page.checked) {
        const pdfBytes = await page.pdfDoc.save();
        const pdfjsDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
        const pdfjsPage = await pdfjsDoc.getPage(page.pageIndex + 1);
        const textContent = await pdfjsPage.getTextContent();

        const textItems = textContent.items.map((item: any) => item.str);
        const pageRow = [`Página ${page.pageIndex + 1}`, ...textItems];
        rows.push(pageRow);
      }
    }

    return rows;
  }
  public exportToExcel(data: string[][]): void {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PDF Data');
    XLSX.writeFile(workbook, 'dados-pdf.xlsx');
  }
}
