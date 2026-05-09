import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentDashboardData } from '../../../../services/student-api.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  @Input() data!: StudentDashboardData;
}
