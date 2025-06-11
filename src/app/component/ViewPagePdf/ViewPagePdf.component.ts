import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

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
