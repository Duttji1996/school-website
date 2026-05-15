import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StudentPortalComponent } from './pages/student-portal/student-portal.component';
import { AboutComponent } from './pages/about/about.component';
import { InstituteComponent } from './pages/institute/institute.component';
import { ContactComponent } from './pages/contact/contact.component';
import { GalleryComponent } from './pages/gallery/gallery.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'portal', component: StudentPortalComponent },
  { path: 'about', component: AboutComponent },
  { path: 'institute', component: InstituteComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' },
];
