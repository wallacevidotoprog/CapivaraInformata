import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
// import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
// @ts-ignore
// import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import { PdfPage } from '../../../module/model/check-select.model';
import { LoadingCapComponent } from '../../component/loading-cap/loading-cap.component';
import { ViewPagePdfComponent } from '../../component/ViewPagePdf/ViewPagePdf.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const pdfWorker = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url);
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.toString();

@Component({
  selector: 'page-pdf',
  standalone: true,
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
  imports: [CommonModule, LoadingCapComponent, ViewPagePdfComponent,DragDropModule],
})
export class PagePdfComponent {
  @ViewChild('pagesContainer', { static: true }) pagesContainer!: ElementRef;

  pages: PdfPage[] = [];
  addFile = false;
  loading = false;
  showModal = false;
  canvasImg: string = '';

  async onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files.length) return;
    this.addFile = true;
    this.loading = true;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pdfjsDoc = await pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;

      for (let pageNum = 1; pageNum <= pdfjsDoc.numPages; pageNum++) {
        const page = await pdfjsDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1 });
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
    this.loading = false;
    console.log(this.pages);
    
  }

  async downloadFullPDF() {
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
  async downloadSeparatePDF() {
    for (const page of this.pages) {
      if (page.checked) {
        const novoPdf = await PDFDocument.create();
        const [copiedPage] = await novoPdf.copyPages(page.pdfDoc, [
          page.pageIndex,
        ]);
        novoPdf.addPage(copiedPage);

        const pdfBytes = await novoPdf.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], {
          type: 'application/pdf',
        });
        // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `capivara-pdf--pagina-${page.id.substring(0,page.id.indexOf('.pdf'))}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  }
  clearFile() {
    this.pages = [];
    this.addFile = false;
    this.showModal = false;
  }

  onSelectChange(event: any) {
    const value = event.target.value;

    if (value === 'download') {
      this.downloadFullPDF();
    } else if (value === 'download-separately') {
      this.downloadSeparatePDF();
    }
  }

  remove_undo(id: string) {
    const index = this.pages.findIndex((page) => page.id === id);
    this.pages[index].checked = !this.pages[index].checked;
  }

  viewPdf(id: string) {
    const page = this.pages.find((p) => p.id === id);
    this.canvasImg = page?.canvasImg || '';
    this.showModal = true;
  }

  closeModalPagePdf() {
    this.canvasImg = '';
    this.showModal = false;
  }

  drop(event: CdkDragDrop<PdfPage[]>) {
  moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
}
}
