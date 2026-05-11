import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

// ==========================================
// JSON STRUCTURE DEFINITIONS FOR BACKEND API
// ==========================================

export type UserRole = 'admin' | 'teacher' | 'student';

export interface LoginResponse {
  success: boolean;
  token: string;
  userId: string;
  role: UserRole;
  message: string;
}

export interface ExamResult {
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  date: string;
}

export interface AttendanceRecord {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  percentage: number;
}

export interface AttendanceDetail {
  date: string;
  status: 'present' | 'absent' | 'holiday' | 'sunday';
}

export interface Holiday {
  date: string;
  name: string;
}

export interface StudentProgress {
  overallPercentage: number;
  remarks: string;
  lastUpdated: string;
}

export interface Homework {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'assigned' | 'submitted';
  grade?: string;
}

export interface PaymentHistory {
  receiptNo: string;
  date: string;
  amount: number;
  method: string;
}

export interface FeeDetails {
  totalAnnualFee: number;
  paidAmount: number;
  pendingAmount: number;
  paidTillMonth: string;
  lastPaymentDate: string;
}

export interface StudentProfile {
  dob: string;
  gender: string;
  bloodGroup: string;
  fatherName: string;
  motherName: string;
  aadharId: string;
  contactNo: string;
  address: string;
  admissionDate: string;
}

export interface TeacherReview {
  date: string;
  teacherName: string;
  subject: string;
  feedback: string;
}

// MANAGEMENT MODELS
export interface SchoolStudent {
  id: string;
  name: string;
  email: string;
  className: string;
  section: string;
  status: 'active' | 'pending' | 'rejected';
  rollNo?: string;
  dob?: string;
  gender?: string;
  fatherName?: string;
  motherName?: string;
  aadharId?: string;
  bloodGroup?: string;
  admissionDate?: string;
  contactNo?: string;
  address?: string;
}

export interface SchoolTeacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  salary: number;
  attendance: number;
  lastSalaryCredited?: string;
  joiningDate: string;
}

export interface ClassFeeStructure {
  className: string;
  monthlyFee: number;
  annualFee: number;
}

export interface StudentDashboardData {
  userId: string;
  studentName: string;
  className: string;
  section: string;
  rollNumber: string;
  profileImage: string;
  profileDetails: StudentProfile;
  attendance: AttendanceRecord;
  attendanceDetails: AttendanceDetail[];
  holidayCalendar: Holiday[];
  progress: StudentProgress;
  recentExams: ExamResult[];
  homework: Homework[];
  feeDetails: FeeDetails;
  paymentHistory: PaymentHistory[];
  reviews: TeacherReview[];
}

export interface TeacherDashboardData {
  userId: string;
  teacherName: string;
  email: string;
  subject: string;
  attendance: number;
  salary: number;
  lastSalaryCredited: string;
  myStudents: SchoolStudent[];
  myHomeworks: Homework[];
  salaryHistory: PaymentHistory[];
}

export interface AdminDashboardData {
  totalStudents: number;
  totalTeachers: number;
  totalFeesCollected: number;
  pendingFees: number;
  students: SchoolStudent[];
  teachers: SchoolTeacher[];
  feeStructures: ClassFeeStructure[];
}

@Injectable({
  providedIn: 'root'
})
export class SchoolApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';
  
  constructor() { }

  private getAuthHeaders() {
    const token = localStorage.getItem('udcs_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Dummy Login API with role detection
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        if (res.success && res.token) {
          localStorage.setItem('udcs_token', res.token);
          localStorage.setItem('udcs_role', res.role);
          localStorage.setItem('udcs_userId', res.userId);
        }
      })
    );
  }

  getStudentData(userId: string): Observable<StudentDashboardData> {
    return this.http.get<StudentDashboardData>(`${this.baseUrl}/student/dashboard/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getTeacherData(userId: string): Observable<TeacherDashboardData> {
    return this.http.get<TeacherDashboardData>(`${this.baseUrl}/teacher/dashboard/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAdminData(): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>(`${this.baseUrl}/admin/dashboard`, {
      headers: this.getAuthHeaders()
    });
  }

  // Management Actions
  registerTeacher(teacher: Partial<SchoolTeacher>): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/teachers`, teacher, {
      headers: this.getAuthHeaders()
    });
  }

  registerStudent(student: Partial<SchoolStudent>): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/students`, student, {
      headers: this.getAuthHeaders()
    });
  }

  updateStudent(studentId: string, student: Partial<SchoolStudent>): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/students/${studentId}`, student, {
      headers: this.getAuthHeaders()
    });
  }

  approveStudent(studentId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/students/approve/${studentId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  processSalary(teacherId: string, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/payroll/credit`, { teacherId, amount }, {
      headers: this.getAuthHeaders()
    });
  }

  assignHomework(hw: Partial<Homework>): Observable<any> {
    return this.http.post(`${this.baseUrl}/teacher/homework`, hw, {
      headers: this.getAuthHeaders()
    });
  }

  submitFeePayment(userId: string, amount: number): Observable<{ success: boolean; transactionId: string; message: string }> {
    return this.http.post<{ success: boolean; transactionId: string; message: string }>(
      `${this.baseUrl}/student/fees/pay`, 
      { userId, amount },
      { headers: this.getAuthHeaders() }
    );
  }
}
