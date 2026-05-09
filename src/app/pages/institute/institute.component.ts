import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-institute',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './institute.component.html',
  styleUrl: './institute.component.css',
})
export class InstituteComponent {
  // Logic for Institute page can be added here
}
