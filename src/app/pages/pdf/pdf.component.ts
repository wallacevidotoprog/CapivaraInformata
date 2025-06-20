import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { PdfEdit } from '../../../services/pdf-edit.service';
import { LoadingCapComponent } from '../../component/loading-cap/loading-cap.component';
import { ViewPagePdfComponent } from '../../component/ViewPagePdf/ViewPagePdf.component';

const pdfWorker = new URL(
     'pdfjs-dist/build/pdf.worker.min.mjs',
     import.meta.url
);
pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.mjs';

@Component({
     selector: 'page-pdf',
     standalone: true,
     templateUrl: './pdf.component.html',
     styleUrls: ['./pdf.component.scss'],
     imports: [
          CommonModule,
          LoadingCapComponent,
          ViewPagePdfComponent,
          DragDropModule,
     ],
})
export class PagePdfComponent {
     protected pdfEdit: PdfEdit = new PdfEdit();

     addFile = false;
     loading = false;
     showModal = false;
     canvasImg: string = '';

     async onFileChange(event: any) {
          this.addFile = true;
          this.loading = true;

          await this.pdfEdit.onFileChange(event);

          this.loading = false;
     }

     clearFile() {
          this.pdfEdit.clearFile();
          this.addFile = false;
          this.showModal = false;
     }

     viewPdf(id: string) {
          const page = this.pdfEdit.getPages().find((p) => p.id === id);
          this.canvasImg = page?.canvasImg || '';
          this.showModal = true;
     }

     closeModalPagePdf() {
          this.canvasImg = '';
          this.showModal = false;
     }
}
