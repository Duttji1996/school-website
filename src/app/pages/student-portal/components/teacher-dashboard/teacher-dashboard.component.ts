import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SchoolApiService, TeacherDashboardData, Homework } from '../../../../services/school-api.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent {
  @Input() data!: TeacherDashboardData;
  private api = inject(SchoolApiService);

  activeTab: 'overview' | 'students' | 'homework' | 'stats' = 'overview';
  
  newHomework: Partial<Homework> = { subject: '', title: '', dueDate: '', status: 'assigned' };
  isProcessing = false;

  switchTab(tab: any) {
    this.activeTab = tab;
  }

  handlePostHomework() {
    this.isProcessing = true;
    this.newHomework.subject = this.data.subject;
    this.api.assignHomework(this.newHomework).subscribe(() => {
      this.isProcessing = false;
      alert('Homework assigned to class!');
      this.newHomework = { subject: '', title: '', dueDate: '', status: 'assigned' };
    });
  }

  handleGiveReview(studentName: string) {
    const feedback = prompt('Enter your review for ' + studentName);
    if (feedback) {
      alert('Review submitted for ' + studentName);
    }
  }
}
