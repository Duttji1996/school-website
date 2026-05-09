import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentDashboardData } from '../../../../services/student-api.service';

@Component({
  selector: 'app-homework',
  imports: [CommonModule],
  templateUrl: './homework.component.html',
  styleUrl: './homework.component.css'
})
export class HomeworkComponent {
  @Input() data!: StudentDashboardData;
}
