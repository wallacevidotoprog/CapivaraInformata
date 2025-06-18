import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

// import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'; 
// import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'; \\final 
// import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';

const pdfWorker = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url);
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.toString();
pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.mjs';
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

@Component({
  selector: 'view-page-pdf',
  standalone: true,
  templateUrl: './ViewPagePdf.component.html',
  styleUrls: ['./ViewPagePdf.component.scss'],
  imports:[CommonModule]
})
export class ViewPagePdfComponent  {
  @Input() canvasImg: string = '';
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
 

  fechar() {
    this.visible = false;
     this.close.emit();
  }
}
