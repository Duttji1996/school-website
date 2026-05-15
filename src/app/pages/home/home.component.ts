import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], // Allows the use of routerLink in HTML
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}