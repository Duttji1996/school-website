import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Import your new components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Add them here so the HTML recognizes the tags
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Usha Devi Convent School';
}