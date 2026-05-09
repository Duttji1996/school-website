import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// ==========================================
// JSON STRUCTURE DEFINITIONS FOR BACKEND API
// ==========================================

export interface LoginResponse {
  success: boolean;
  token: string;
  studentId: string;
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
  grade?: string; // Optional, only if submitted and graded
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

export interface StudentDashboardData {
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  rollNumber: string;
  profileImage: string;
  profileDetails: StudentProfile;
  attendance: AttendanceRecord;
  progress: StudentProgress;
  recentExams: ExamResult[];
  homework: Homework[];
  feeDetails: FeeDetails;
  paymentHistory: PaymentHistory[];
  reviews: TeacherReview[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentApiService {
  
  constructor() { }

  /**
   * Dummy Login API
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const dummyResponse: LoginResponse = {
      success: true,
      token: 'dummy-jwt-token-xyz-123',
      studentId: 'STU2027001',
      message: 'Login successful'
    };
    return of(dummyResponse).pipe(delay(800));
  }

  /**
   * Dummy Dashboard Data API
   */
  getDashboardData(studentId: string): Observable<StudentDashboardData> {
    const dummyData: StudentDashboardData = {
      studentId: studentId,
      studentName: 'Aarav Sharma',
      className: 'Class 4',
      section: 'A',
      rollNumber: '12',
      profileImage: 'https://images.unsplash.com/photo-1595454223600-91fc4c8ea11b?auto=format&fit=crop&w=200',
      profileDetails: {
        dob: '2016-08-14',
        gender: 'Male',
        bloodGroup: 'O+',
        fatherName: 'Rajesh Sharma',
        motherName: 'Meera Sharma',
        aadharId: '1234 5678 9012',
        contactNo: '+91 98765 43210',
        address: '14, Sunrise Apartments, Lalganj, Mirzapur, 231211 (UP)',
        admissionDate: '2023-04-05'
      },
      attendance: { totalDays: 120, presentDays: 108, absentDays: 12, percentage: 90 },
      progress: {
        overallPercentage: 85.5,
        remarks: 'Excellent progress in Mathematics and Science. Needs slight improvement in Languages.',
        lastUpdated: '2026-05-01'
      },
      recentExams: [
        { subject: 'Mathematics', totalMarks: 100, obtainedMarks: 92, grade: 'A+', date: '2026-04-10' },
        { subject: 'Science', totalMarks: 100, obtainedMarks: 88, grade: 'A', date: '2026-04-12' },
        { subject: 'English', totalMarks: 100, obtainedMarks: 78, grade: 'B+', date: '2026-04-15' },
        { subject: 'Hindi', totalMarks: 100, obtainedMarks: 84, grade: 'A', date: '2026-04-18' }
      ],
      homework: [
        { id: 'HW1', subject: 'Mathematics', title: 'Fractions Worksheet', dueDate: '2026-05-12', status: 'assigned' },
        { id: 'HW2', subject: 'Science', title: 'Solar System Project Model', dueDate: '2026-05-15', status: 'assigned' },
        { id: 'HW3', subject: 'English', title: 'Grammar Essay', dueDate: '2026-05-05', status: 'submitted', grade: 'A' },
        { id: 'HW4', subject: 'Hindi', title: 'Kavita Path', dueDate: '2026-05-08', status: 'submitted', grade: 'B+' }
      ],
      feeDetails: {
        totalAnnualFee: 45000,
        paidAmount: 22500,
        pendingAmount: 22500,
        paidTillMonth: 'September 2026',
        lastPaymentDate: '2026-04-01'
      },
      paymentHistory: [
        { receiptNo: 'RCPT-2026-001', date: '2026-04-01', amount: 22500, method: 'Online / UPI' },
        { receiptNo: 'RCPT-2025-089', date: '2025-10-15', amount: 22500, method: 'Bank Transfer' }
      ],
      reviews: [
        { date: '2026-05-02', teacherName: 'Mr. Verma', subject: 'Mathematics', feedback: 'Aarav is an exceptionally bright student. He grasps mathematical concepts very quickly and is always eager to participate in class discussions.' },
        { date: '2026-04-20', teacherName: 'Mrs. Gupta', subject: 'English', feedback: 'Needs to focus a bit more on reading comprehension. However, his writing skills are improving steadily.' },
        { date: '2026-03-15', teacherName: 'Ms. Reddy', subject: 'Science', feedback: 'Showed great enthusiasm during the solar system project. Creative and well-organized work.' }
      ]
    };

    return of(dummyData).pipe(delay(800));
  }

  /**
   * Dummy Payment Processing API
   * Endpoint: POST /api/payment/pay-fees
   * Expected Payload: { studentId: string, amount: number, paymentMethod: string }
   */
  submitFeePayment(studentId: string, amount: number): Observable<{ success: boolean; transactionId: string; message: string }> {
    const dummyPaymentResponse = {
      success: true,
      transactionId: 'TXN-' + Math.floor(Math.random() * 100000000),
      message: 'Payment successfully processed'
    };
    // Simulate payment gateway delay (1.5 seconds)
    return of(dummyPaymentResponse).pipe(delay(1500));
  }
}
