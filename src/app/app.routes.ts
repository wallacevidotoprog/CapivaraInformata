import { Routes } from '@angular/router';
import { PagePdfComponent } from './pages/pdf/pdf.component';
import { PdfConvertComponent } from './pages/pdf-convert/pdf-convert.component';
export const routes: Routes = [
    {path: '', redirectTo: 'page-pdf', pathMatch: 'full'},
    {path: 'page-pdf', component: PagePdfComponent},
    {path: 'page-pdf-convert', component: PdfConvertComponent},
    {path:'**', redirectTo: 'home', pathMatch: 'full'},
];
