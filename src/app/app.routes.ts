import { Routes } from '@angular/router';
import { PagePdfComponent } from './pages/pdf/pdf.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'page-pdf', component: PagePdfComponent},
    {path:'**', redirectTo: 'home', pathMatch: 'full'},
];
