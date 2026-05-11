import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SchoolApiService, UserRole, StudentDashboardData, TeacherDashboardData, AdminDashboardData } from '../../services/school-api.service';
import { OverviewComponent } from './components/overview/overview.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeworkComponent } from './components/homework/homework.component';
import { FeesComponent } from './components/fees/fees.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    OverviewComponent, 
    ProfileComponent, 
    HomeworkComponent, 
    FeesComponent, 
    ReviewsComponent, 
    AttendanceComponent,
    AdminDashboardComponent,
    TeacherDashboardComponent
  ],
  templateUrl: './student-portal.component.html',
  styleUrl: './student-portal.component.css',
})
export class StudentPortalComponent implements OnInit {
  private schoolApi = inject(SchoolApiService);

  isLoggedIn = false;
  isLoading = false;
  showSignupPopup = false;
  loginError = '';
  
  userRole: UserRole | null = null;
  studentData: StudentDashboardData | null = null;
  teacherData: TeacherDashboardData | null = null;
  adminData: AdminDashboardData | null = null;

  activeTab: 'overview' | 'profile' | 'attendance' | 'homework' | 'fees' | 'reviews' = 'overview';

  email = '';
  password = '';

  ngOnInit() {
    this.checkSession();
  }

  checkSession() {
    const token = localStorage.getItem('udcs_token');
    const role = localStorage.getItem('udcs_role') as UserRole;
    const userId = localStorage.getItem('udcs_userId');

    if (token && role && userId) {
      this.isLoading = true;
      this.userRole = role;
      this.fetchRoleSpecificData(userId, role);
    }
  }

  openSignup() {
    this.showSignupPopup = true;
  }

  closeSignup() {
    this.showSignupPopup = false;
  }

  switchTab(tab: any) {
    this.activeTab = tab;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if (!imgElement.src.includes('ui-avatars.com')) {
      const fallbackName = this.studentData?.studentName || this.teacherData?.teacherName || 'User';
      imgElement.src = `https://ui-avatars.com/api/?name=${fallbackName}&background=fadb5f&color=0c1e33`;
    }
  }

  handleLogin(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.loginError = '';

    this.schoolApi.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.userRole = response.role;
          this.fetchRoleSpecificData(response.userId, response.role);
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

  fetchRoleSpecificData(userId: string, role: UserRole) {
    if (role === 'student') {
      this.schoolApi.getStudentData(userId).subscribe({
        next: (data) => {
          this.studentData = data;
          this.finishLogin();
        },
        error: () => this.logout()
      });
    } else if (role === 'teacher') {
      this.schoolApi.getTeacherData(userId).subscribe({
        next: (data) => {
          this.teacherData = data;
          this.finishLogin();
        },
        error: () => this.logout()
      });
    } else if (role === 'admin') {
      this.schoolApi.getAdminData().subscribe({
        next: (data) => {
          this.adminData = data;
          this.finishLogin();
        },
        error: () => this.logout()
      });
    }
  }

  finishLogin() {
    this.isLoggedIn = true;
    this.isLoading = false;
  }

  logout() {
    localStorage.removeItem('udcs_token');
    localStorage.removeItem('udcs_role');
    localStorage.removeItem('udcs_userId');
    this.isLoggedIn = false;
    this.userRole = null;
    this.studentData = null;
    this.teacherData = null;
    this.adminData = null;
    this.activeTab = 'overview';
    this.email = '';
    this.password = '';
  }
}
