import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentApiService, StudentDashboardData } from '../../services/student-api.service';
import { OverviewComponent } from './components/overview/overview.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeworkComponent } from './components/homework/homework.component';
import { FeesComponent } from './components/fees/fees.component';
import { ReviewsComponent } from './components/reviews/reviews.component';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, OverviewComponent, ProfileComponent, HomeworkComponent, FeesComponent, ReviewsComponent],
  templateUrl: './student-portal.component.html',
  styleUrl: './student-portal.component.css',
})
export class StudentPortalComponent {
  private studentApi = inject(StudentApiService);

  isLoggedIn = false;
  isLoading = false;
  showSignupPopup = false;
  loginError = '';
  
  dashboardData: StudentDashboardData | null = null;

  activeTab: 'overview' | 'profile' | 'homework' | 'fees' | 'reviews' = 'overview';

  openSignup() {
    this.showSignupPopup = true;
  }

  closeSignup() {
    this.showSignupPopup = false;
  }

  switchTab(tab: 'overview' | 'profile' | 'homework' | 'fees' | 'reviews') {
    this.activeTab = tab;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if (!imgElement.src.includes('ui-avatars.com')) {
      const fallbackName = this.dashboardData?.studentName || 'Student';
      imgElement.src = `https://ui-avatars.com/api/?name=${fallbackName}&background=fadb5f&color=0c1e33`;
    }
  }

  handleLogin(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.loginError = '';

    this.studentApi.login('test@student.com', 'password').subscribe({
      next: (response) => {
        if (response.success) {
          this.fetchDashboardData(response.studentId);
        } else {
          this.loginError = 'Invalid credentials';
          this.isLoading = false;
        }
      },
      error: () => {
        this.loginError = 'Server error. Please try again.';
        this.isLoading = false;
      }
    });
  }

  fetchDashboardData(studentId: string) {
    this.studentApi.getDashboardData(studentId).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoggedIn = true;
        this.isLoading = false;
      },
      error: () => {
        this.loginError = 'Failed to load dashboard data.';
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.isLoggedIn = false;
    this.dashboardData = null;
    this.activeTab = 'overview';
  }
}
