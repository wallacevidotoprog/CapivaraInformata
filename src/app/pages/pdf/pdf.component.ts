import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PdfEdit } from '../../../services/pdf-edit.service';
import { LoadingCapComponent } from '../../component/loading-cap/loading-cap.component';
import { ViewPagePdfComponent } from '../../component/ViewPagePdf/ViewPagePdf.component';

@Component({
  selector: 'page-pdf',
  standalone: true,
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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

  constructor(private cdr: ChangeDetectorRef) {}

  async onFileChange(event: any) {
    this.addFile = true;
    this.loading = true;
    this.cdr.markForCheck();

    await this.pdfEdit.onFileChange(event);

    this.loading = false;
    this.cdr.markForCheck();
  }

  clearFile() {
    this.pdfEdit.clearFile();
    this.addFile = false;
    this.showModal = false;
    this.cdr.markForCheck();
  }

  viewPdf(id: string) {
    const page = this.pdfEdit.getPages().find((p) => p.id === id);
    this.canvasImg = page?.canvasImg || '';
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModalPagePdf() {
    this.canvasImg = '';
    this.showModal = false;
    this.cdr.markForCheck();
  }
}
