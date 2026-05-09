import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentDashboardData } from '../../../../services/student-api.service';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
  @Input() data!: StudentDashboardData;
}
