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

  activeTab: 'overview' | 'students' | 'homework' | 'stats' | 'security' = 'overview';
  
  // Security
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  isError = false;

  handleChangePassword() {
    if (!this.oldPassword || !this.newPassword) {
      this.message = 'Please fill all fields';
      this.isError = true;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      this.isError = true;
      return;
    }

    this.isProcessing = true;
    this.message = '';

    this.api.changePassword({
      userId: this.data.userId,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.isProcessing = false;
        this.message = 'Password updated successfully!';
        this.isError = false;
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.isProcessing = false;
        this.message = err.error?.message || 'Failed to update password';
        this.isError = true;
      }
    });
  }
  
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
