import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'page-pdf', pathMatch: 'full' },
  {
    path: 'page-pdf',
    loadComponent: () =>
      import('./pages/pdf/pdf.component').then((m) => m.PagePdfComponent),
  },
  { path: '**', redirectTo: 'page-pdf', pathMatch: 'full' },
];
