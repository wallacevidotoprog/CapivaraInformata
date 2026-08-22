import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'view-page-pdf',
  standalone: true,
  templateUrl: './ViewPagePdf.component.html',
  styleUrls: ['./ViewPagePdf.component.scss'],
})
export class ViewPagePdfComponent {
  @Input() canvasImg: string = '';
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  fechar() {
    this.visible = false;
    this.close.emit();
  }
}
