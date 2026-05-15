import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentDashboardData, SchoolApiService } from '../../../../services/school-api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  @Input() data!: StudentDashboardData;
  private schoolApi = inject(SchoolApiService);

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
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

    this.isLoading = true;
    this.message = '';

    const payload = {
      userId: this.data.userId,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.schoolApi.changePassword(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = 'Password updated successfully!';
        this.isError = false;
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = err.error?.message || 'Failed to update password';
        this.isError = true;
      }
    });
  }
}
