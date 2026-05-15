import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
    RouterLink,
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

  isSignupMode = false;
  signupSuccess = false;
  signupData = {
    fullName: '',
    email: '',
    password: ''
  };

  activeTab: 'overview' | 'profile' | 'attendance' | 'homework' | 'fees' | 'reviews' = 'overview';
  adminActiveTab: 'overview' | 'pending' | 'students' | 'teachers' | 'fees' | 'payroll' | 'circulars' | 'inquiries' = 'overview';

  email = '';
  password = '';
  
  // Forgot Password Flow
  forgotPasswordState: 'none' | 'request' | 'verify' | 'reset' = 'none';
  otp = '';
  newPassword = '';
  resendDisabled = false;
  resendCountdown = 0;
  showForgotPasswordLink = false;

  today = new Date();

  ngOnInit() {
    this.checkSession();
  }

  handleForgotPasswordRequest() {
    if (!this.email) {
      this.loginError = 'Please enter your email first';
      return;
    }
    this.isLoading = true;
    this.schoolApi.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.forgotPasswordState = 'verify';
        this.loginError = '';
        this.startResendTimer();
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = err.error?.message || 'Email not found';
      }
    });
  }

  handleVerifyOTP() {
    if (!this.otp || this.otp.length < 6) return;
    this.isLoading = true;
    this.schoolApi.verifyOTP(this.email, this.otp).subscribe({
      next: () => {
        this.isLoading = false;
        this.forgotPasswordState = 'reset';
        this.loginError = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = err.error?.message || 'Invalid OTP';
      }
    });
  }

  handleResetPassword() {
    if (!this.newPassword || this.newPassword.length < 6) return;
    this.isLoading = true;
    this.schoolApi.resetPassword({ email: this.email, otp: this.otp, newPassword: this.newPassword }).subscribe({
      next: () => {
        this.isLoading = false;
        this.forgotPasswordState = 'none';
        this.signupSuccess = true; // Use this to show "Password reset successful"
        this.otp = '';
        this.newPassword = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = err.error?.message || 'Failed to reset password';
      }
    });
  }

  handleResendOTP() {
    if (this.resendDisabled) return;
    this.schoolApi.resendOTP(this.email).subscribe(() => {
      this.startResendTimer();
    });
  }

  startResendTimer() {
    this.resendDisabled = true;
    this.resendCountdown = 60;
    const interval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.resendDisabled = false;
        clearInterval(interval);
      }
    }, 1000);
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

  switchAdminTab(tab: any) {
    this.activeTab = 'overview';
    this.adminActiveTab = tab;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if (!imgElement.src.includes('ui-avatars.com')) {
      const fallbackName = this.studentData?.studentName || this.teacherData?.teacherName || 'User';
      imgElement.src = `https://ui-avatars.com/api/?name=${fallbackName}&background=fadb5f&color=0c1e33`;
    }
  }

  handleSignup(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.loginError = '';
    this.signupSuccess = false;

    // Simulate 3s "Sending/Saving" state for better UX as requested
    setTimeout(() => {
      this.schoolApi.signup(this.signupData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.signupSuccess = true;
          // Clear form after delay
          setTimeout(() => {
            this.isSignupMode = false;
            this.email = this.signupData.email;
          }, 3000);
        },
        error: (err) => {
          this.loginError = err.error?.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });
    }, 3000);
  }

  toggleSignup() {
    this.isSignupMode = !this.isSignupMode;
    this.loginError = '';
    this.signupSuccess = false;
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
          this.showForgotPasswordLink = false;
        } else {
          this.loginError = 'Invalid credentials';
          this.showForgotPasswordLink = true;
          this.isLoading = false;
        }
      },
      error: () => {
        this.loginError = 'Server error. Please try again.';
        this.showForgotPasswordLink = true;
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
