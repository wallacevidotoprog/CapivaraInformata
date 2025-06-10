import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import { CheckSelectModelPagePDF, PdfPage } from '../../../module/model/check-select.model';
import { LoadingCapComponent } from "../../component/loading-cap/loading-cap.component";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfFile {
  fileName: string;
  pdfLibDoc: PDFDocument;
  pdfjsDoc: any;
  pagesPDF: CheckSelectModelPagePDF[];
  excludedPages: number[];
}

@Component({
  selector: 'page-pdf',
  standalone: true,
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
  imports: [CommonModule, LoadingCapComponent],
})
export class PagePdfComponent  {


  @ViewChild('pagesContainer', { static: true }) pagesContainer!: ElementRef;

  pages: PdfPage[] = [];
  addFile = false;
  loading = false;

  async onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files.length) return;
    this.addFile = true;
    this.loading = true;


    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      
      // Carregar o PDF com pdf-lib para manipulação
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Renderizar cada página para preview usando pdfjs-dist
      const pdfjsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

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
          canvasImg
        });
      }
    }
    this.loading = false;
  }

  // Selecionar páginas para exclusão
  togglePageSelection(id: string) {
    // implementar lógica para marcar/desmarcar página como selecionada
    // para exclusão, por exemplo com um Set<string> de selectedPages
  }

  // Reorganizar páginas (por exemplo, usando drag&drop - libraria externa)
  reorderPages(newOrder: PdfPage[]) {
    this.pages = newOrder;
  }

  // Baixar PDF juntando as páginas selecionadas
  async baixarPDF() {
    const novoPdf = await PDFDocument.create();

    for (const page of this.pages) {
      const [copiedPage] = await novoPdf.copyPages(page.pdfDoc, [page.pageIndex]);
      novoPdf.addPage(copiedPage);
    }

    const pdfBytes = await novoPdf.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: 'application/pdf',
    });
    //const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arquivo-mesclado.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Limpar arquivos carregados
  clearFile() {
    this.pages = [];
    this.addFile = false;
  }

  onSelectChange(event: any) {
  const value = event.target.value;

  if (value === 'download') {
    this.baixarPDF();
  } else if (value === 'download-separately') {
    this.baixarSeparado();
  }
}

removerPagina(id: string) {
  this.pages = this.pages.filter(page => page.id !== id);
}

async baixarSeparado() {
  for (const page of this.pages) {
    const novoPdf = await PDFDocument.create();
    const [copiedPage] = await novoPdf.copyPages(page.pdfDoc, [page.pageIndex]);
    novoPdf.addPage(copiedPage);

    const pdfBytes = await novoPdf.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: 'application/pdf',
    });
    // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pagina-${page.id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }
}


//   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
//   @ViewChild('addFileInput') addFileInput!: ElementRef<HTMLInputElement>;
//   @ViewChild('pagesContainer') pagesContainer!: ElementRef<HTMLDivElement>;
//   @ViewChild('modalCanvas') modalCanvas!: ElementRef<HTMLCanvasElement>;

//   @ViewChild('canvasVisualizacao', { static: false })
//   canvasVisualizacao!: ElementRef<HTMLCanvasElement>;

//   pagesPDF: CheckSelectModelPagePDF[] = [];
//   pdfLibDoc: PDFDocument | null = null;

//   pdfs: PdfFile[] = []; // ARMAZENA TODOS OS PDFs CARREGADOS
//   currentPdfIndex: number = 0; // Para saber qual PDF está ativo na UI (opcional)

//   pdfDoc: any = null;
//   excludedPages: number[] = [];
//   fileName = '';
//   originalPdfBytes: Uint8Array | null = null;
//   showModal = false;
//   addFile = false;

//   currentPageForModal: number | null = null;

//   ngAfterViewInit(): void {
//     this.addFile = false;
//   }

//   async onFileChange(event: Event) {
//   const files = (event.target as HTMLInputElement).files;
//   if (!files || files.length === 0) return;

//   for (const file of Array.from(files)) {
//     if (file.type !== 'application/pdf') continue;

//     const typedArray = await this.readFileAsUint8Array(file);
//     const pdfjsDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;

//     // Pegamos as páginas do PDF novo e adicionamos ao final do pagesPDF atual
//     const startIndex = this.pagesPDF.length; // para numerar páginas sequencialmente

//     for (let i = 1; i <= pdfjsDoc.numPages; i++) {
//       const page = await pdfjsDoc.getPage(i);
//       const viewport = page.getViewport({ scale: 1 });
//       this.pagesPDF.push({
//         checked: false,
//         pageNumber: startIndex + i, // número sequencial considerando páginas anteriores
//         viewport,
//         context: null,
//         page,
//       });
//     }
//   }

//   // Depois que adicionou todas as páginas dos PDFs selecionados, renderiza tudo
//   await this.exibirTodasAsPaginas();
// }


//   // async onFileChange(event: Event) {
//   //   const files = (event.target as HTMLInputElement).files;
//   //   const pdfs: { name: string; doc: any }[] = [];

//   //   if (!files || files.length === 0) return;

//   //   for (const file of Array.from(files)) {
//   //     if (file.type !== 'application/pdf') continue;

//   //     this.fileName = file.name.replace(/\.[^/.]+$/, '');
//   //     const typedArray = await this.readFileAsUint8Array(file);
//   //     this.pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;

//   //     await this.pagesSetting(this.pdfDoc);
//   //     await this.exibirTodasAsPaginas();
//   //     this.addFile = true;
//   //   }
//   //   return;
//   // }

//   async onAddFileChange(event: Event) {
//     // const file = (event.target as HTMLInputElement).files?.[0];
//     // if (!file || file.type !== 'application/pdf') return;
//     // this.fileName = file.name.replace(/\.[^/.]+$/, '');
//     // const reader = new FileReader();
//     // reader.onload = async () => {
//     //   const typedArray = new Uint8Array(reader.result as ArrayBuffer);
//     //   this.originalPdfBytes = typedArray;
//     //   this.pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
//     //   await this.pagesSetting();
//     //   await this.exibirTodasAsPaginas();
//     // };
//     // reader.readAsArrayBuffer(file);
//   }

//   readFileAsUint8Array(file: File): Promise<Uint8Array> {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         resolve(new Uint8Array(reader.result as ArrayBuffer));
//       };
//       reader.onerror = (error) => {
//         reject(error);
//       };
//       reader.readAsArrayBuffer(file);
//     });
//   }

//   async pagesSetting(doc: any) {
//     for (let i = 1; i <= doc.numPages; i++) {
//       const page = await doc.getPage(i);
//       const viewport = page.getViewport({ scale: 1 });
//       this.pagesPDF.push({
//         checked: false,
//         pageNumber: i,
//         viewport: viewport,
//         context: null,
//         page: page,
//       });
//     }
//   }
//   renderizarPagina(
//     pagina: CheckSelectModelPagePDF,
//     canvas: HTMLCanvasElement,
//     scale: number = 1.5
//   ): void {
//     const viewport = pagina.page.getViewport({ scale });

//     const context = canvas.getContext('2d');
//     if (!context) return;

//     canvas.width = viewport.width;
//     canvas.height = viewport.height;

//     pagina.page.render({
//       canvasContext: context,
//       viewport,
//     });
//   }

//   // async exibirTodasAsPaginas() {
//   //   const container = this.pagesContainer.nativeElement;
//   //   container.innerHTML = ''; // limpa antes de renderizar

//   //   for (const pagina of this.pagesPDF) {
//   //     const canvas = document.createElement('canvas');
//   //     canvas.classList.add('page-canvas');
//   //     canvas.setAttribute('data-page', pagina.pageNumber.toString());

//   //     // Renderiza no canvas criado
//   //     await this.renderizarPagina(pagina, canvas, 0.5); // ou scale: 1 se preferir em tamanho real

//   //     // Card opcional para botões (ex: excluir / visualizar)
//   //     const card = document.createElement('div');
//   //     card.classList.add('page-card');
//   //     if (pagina.checked) card.classList.add('excluded'); // exemplo de marcação visual

//   //     const actions = document.createElement('div');
//   //     actions.classList.add('page-actions');

//   //     const view = document.createElement('button');
//   //     view.innerText = '👁️ Visualizar';
//   //     view.classList.add('btn-view');
//   //     view.onclick = () => this.visualizarPagina(pagina.pageNumber);

//   //     const exclude = document.createElement('button');
//   //     exclude.innerText = pagina.checked ? '↩ Desfazer' : '❌Excluir';
//   //     exclude.classList.add(pagina.checked ? 'btn-undo' : 'btn-delete');
//   //     exclude.onclick = () => this.toggleExcluir(pagina.pageNumber);

//   //     actions.appendChild(view);
//   //     actions.appendChild(exclude);

//   //     card.appendChild(canvas);
//   //     card.appendChild(actions);
//   //     container.appendChild(card);
//   //   }
//   // }

//   async exibirTodasAsPaginas() {

//     console.log('Exibindo todas as páginas do PDF ativo...');
//     const container = this.pagesContainer.nativeElement;
//     container.innerHTML = ''; // limpa

//     if (this.pdfs.length === 0) return;

//     const pdfAtivo = this.pdfs[this.currentPdfIndex];

//     for (const pagina of pdfAtivo.pagesPDF) {
//       const canvas = document.createElement('canvas');
//       canvas.classList.add('page-canvas');
//       canvas.setAttribute('data-page', pagina.pageNumber.toString());

//       await this.renderizarPagina(pagina, canvas, 0.5);

//       const card = document.createElement('div');
//       card.classList.add('page-card');
//       if (pagina.checked) card.classList.add('excluded');

//       const actions = document.createElement('div');
//       actions.classList.add('page-actions');

//       const view = document.createElement('button');
//       view.innerText = '👁️ Visualizar';
//       view.classList.add('btn-view');
//       view.onclick = () => this.visualizarPagina(pagina.pageNumber);

//       const exclude = document.createElement('button');
//       exclude.innerText = pagina.checked ? '↩ Desfazer' : '❌Excluir';
//       exclude.classList.add(pagina.checked ? 'btn-undo' : 'btn-delete');
//       exclude.onclick = () => this.toggleExcluir(pagina.pageNumber);

//       actions.appendChild(view);
//       actions.appendChild(exclude);

//       card.appendChild(canvas);
//       card.appendChild(actions);
//       container.appendChild(card);
//     }
//   }

//   toggleExcluir(pageNum: number) {
//     const pdfAtivo = this.pdfs[this.currentPdfIndex];
//     const idx = pdfAtivo.excludedPages.indexOf(pageNum);

//     if (idx === -1) {
//       pdfAtivo.excludedPages.push(pageNum);
//     } else {
//       pdfAtivo.excludedPages.splice(idx, 1);
//     }

//     // Atualiza o estado do checkbox e UI
//     const cards =
//       this.pagesContainer.nativeElement.querySelectorAll('.page-card');
//     const card = Array.from(cards).find((_, i) => i + 1 === pageNum);
//     if (card) {
//       card.classList.toggle('excluded');
//       const button = card.querySelector('button:last-child');
//       if (button) button.textContent = idx === -1 ? '↩ Desfazer' : '❌Excluir';
//     }

//     // Também atualiza o checked na página PDF para refletir a exclusão
//     const pagePDF = this.pdfs[this.currentPdfIndex].pagesPDF.find(
//       (p) => p.pageNumber === pageNum
//     );
//     if (pagePDF) pagePDF.checked = idx === -1;
//   }
//   // toggleExcluir(pageNum: number) {
//   //   const index = this.excludedPages.indexOf(pageNum);
//   //   if (index === -1) {
//   //     this.excludedPages.push(pageNum);
//   //   } else {
//   //     this.excludedPages.splice(index, 1); // desfazer
//   //   }

//   //   // Atualiza visual sem recarregar tudo
//   //   const cards =
//   //     this.pagesContainer.nativeElement.querySelectorAll('.page-card');
//   //   const card = Array.from(cards).find((_, i) => i + 1 === pageNum);
//   //   if (card) {
//   //     card.classList.toggle('excluded');
//   //     const button = card.querySelector('button:last-child');
//   //     if (button)
//   //       button.textContent = index === -1 ? '↩ Desfazer' : '❌Excluir';
//   //   }
//   // }

//   // async visualizarPagina(pageNum: number) {
//   //   if (!this.pdfDoc) return;

//   //   this.currentPageForModal = pageNum;
//   //   const page = await this.pdfDoc.getPage(pageNum);
//   //   const viewport = page.getViewport({ scale: 2.5 });

//   //   const canvas = this.modalCanvas.nativeElement;
//   //   const context = canvas.getContext('2d');
//   //   if (!context) return;

//   //   canvas.width = viewport.width;
//   //   canvas.height = viewport.height;

//   //   await page.render({ canvasContext: context, viewport }).promise;
//   //   this.showModal = true;
//   // }

//   async visualizarPagina(pageNum: number) {
//     const pdfAtivo = this.pdfs[this.currentPdfIndex];
//     if (!pdfAtivo) return;

//     this.currentPageForModal = pageNum;
//     const page = await pdfAtivo.pdfjsDoc.getPage(pageNum);
//     const viewport = page.getViewport({ scale: 2.5 });

//     const canvas = this.modalCanvas.nativeElement;
//     const context = canvas.getContext('2d');
//     if (!context) return;

//     canvas.width = viewport.width;
//     canvas.height = viewport.height;

//     await page.render({ canvasContext: context, viewport }).promise;
//     this.showModal = true;
//   }

//   fecharModal() {
//     this.showModal = false;
//     this.currentPageForModal = null;
//   }

//   onSelectChange(event: Event) {
//     const selectedValue = (event.target as HTMLSelectElement).value;

//     if (selectedValue === 'download') {
//       this.salvarNovoPDF();
//     } else if (selectedValue === 'download-separately') {
//       this.salvarSeparadamente();
//     }
//     (event.target as HTMLSelectElement).value = '';
//   }

//   async salvarNovoPDF() {
//   if (this.pdfs.length === 0) {
//     console.warn('Nenhum PDF carregado.');
//     return;
//   }

//   const newPdf = await PDFDocument.create();

//   for (const pdfObj of this.pdfs) {
//     const pagesToCopy = [];

//     for (let i = 0; i < pdfObj.pagesPDF.length; i++) {
//       const pageNum = i + 1;
//       if (!pdfObj.excludedPages.includes(pageNum)) {
//         pagesToCopy.push(i);
//       }
//     }

//     const copiedPages = await newPdf.copyPages(pdfObj.pdfLibDoc, pagesToCopy);
//     copiedPages.forEach((page) => newPdf.addPage(page));
//   }

//   const pdfBytes = await newPdf.save();
//   const blob = new Blob([new Uint8Array(pdfBytes)], {
//       type: 'application/pdf',
//     });
//   // new Blob([pdfBytes], { type: 'application/pdf' });

//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `merged_editado.pdf`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }

//   // async salvarNovoPDF() {
//   //   console.log('Salvando novo PDF...');
//   //   if (!this.pagesPDF) {
//   //     console.warn('Nenhum PDF carregado.');
//   //     return;
//   //   }

//   //   const newPdf = await PDFDocument.create();

//   //   for (let i = 0; i < this.pagesPDF.length; i++) {
//   //     const pageNum = i + 1;
//   //     if (!this.pagesPDF[i].checked) {
//   //       newPdf.addPage(this.pagesPDF[i].page);
//   //     }
//   //   }

//   //   const pdfBytes = await newPdf.save();
//   //   const blob = new Blob([new Uint8Array(pdfBytes)], {
//   //     type: 'application/pdf',
//   //   });
//   //   const link = document.createElement('a');
//   //   link.href = URL.createObjectURL(blob);
//   //   link.download = `${this.fileName}_editado.pdf`;
//   //   document.body.appendChild(link); // necessário no Safari
//   //   link.click();
//   //   document.body.removeChild(link);
//   // }
//   async salvarSeparadamente() {
//     console.log('Salvando novo PDF...');
//     // if (!this.pagesPDF) {
//     //   console.warn('Nenhum PDF carregado.');
//     //   return;
//     // }

//     // // const originalPdf = await PDFDocument.load(this.originalPdfBytes);
//     // const newPdf = await PDFDocument.create();
//     // //const totalPages = originalPdf.getPageCount();

//     // for (let i = 0; i < this.pagesPDF.length; i++) {
//     //   const pageNum = i + 1;
//     //   if(!this.pagesPDF[i].checked) {
//     //     newPdf.addPage(this.pagesPDF[i].page);
//     //   }
//     //   // if (!this.excludedPages.includes(pageNum)) {
//     //   //   const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
//     //   //   newPdf.addPage(copiedPage);
//     //   // }
//     // }

//     // const pdfBytes = await newPdf.save();
//     // const blob = new Blob([new Uint8Array(pdfBytes)], {
//     //   type: 'application/pdf',
//     // });
//     // const link = document.createElement('a');
//     // link.href = URL.createObjectURL(blob);
//     // link.download = `${this.fileName}_editado.pdf`;
//     // document.body.appendChild(link); // necessário no Safari
//     // link.click();
//     // document.body.removeChild(link);
//   }

//   clearFile() {
//     this.pagesPDF = [];
//     this.pdfDoc = null;
//     this.excludedPages = [];
//     this.fileName = '';
//     this.originalPdfBytes = null;
//     this.showModal = false;
//     this.pagesContainer.nativeElement.innerHTML = '';
//     this.addFile = false;
//   }
}
