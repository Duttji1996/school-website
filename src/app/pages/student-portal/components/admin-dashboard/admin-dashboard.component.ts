import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SchoolApiService, AdminDashboardData, SchoolTeacher, SchoolStudent } from '../../../../services/school-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnChanges {
  @Input() data!: AdminDashboardData;
  @Input() activeTab: 'overview' | 'pending' | 'students' | 'teachers' | 'fees' | 'payroll' | 'circulars' | 'inquiries' = 'overview';
  private api = inject(SchoolApiService);

  selectedStudent: any = null;
  selectedTeacher: any = null;
  circulars: any[] = [];
  contacts: any[] = [];
  newCircular = { title: '', content: '', targetAudience: 'All', category: 'Notice' };
  viewMode: 'list' | 'form' = 'list';
  teacherViewMode: 'list' | 'form' = 'list';
  isEditing = false;
  isEditingTeacher = false;
  editingId = '';
  editingTeacherId = '';
  
  // Filtering
  availableClasses = ['LKG', 'UKG', '1', '2', '3', '4', '5'];
  availableSections = ['1', '2', '3', '4', '5'];
  selectedFilterClass = 'All';
  searchText = '';

  // Forms
  newTeacher: Partial<SchoolTeacher> = { name: '', email: '', subject: '', salary: 0 };
  newStudent: Partial<SchoolStudent> = { 
    name: '', email: '', className: '1', section: '1', 
    dob: '', gender: '', fatherName: '', motherName: '',
    aadharId: '', contactNo: '', address: '' 
  };
  
  maxDob = ''; // To enforce 3 year difference

  ngOnInit() {
    this.setMaxDob();
    this.refreshData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeTab']) {
      this.selectedStudent = null;
      this.selectedTeacher = null;
      this.viewMode = 'list';
      this.teacherViewMode = 'list';
      this.successMessage = '';
    }
  }

  setMaxDob() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 3);
    this.maxDob = today.toISOString().split('T')[0];
  }
  
  isProcessing = false;
  successMessage = '';

  // Analytics - Financial Health
  public financeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };
  public financeChartData: ChartConfiguration['data'] = {
    labels: ['Total Collected', 'Pending Dues'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#5aa112', '#ef4444'],
      hoverBackgroundColor: ['#4d8c0f', '#dc2626']
    }]
  };
  public financeChartType: ChartType = 'doughnut';

  // Analytics - Attendance
  public attendanceChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 100 } }
  };
  public attendanceChartData: ChartConfiguration['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      data: [95, 92, 98, 90, 96],
      label: 'School Attendance %',
      backgroundColor: 'rgba(74, 144, 226, 0.2)',
      borderColor: '#4a90e2',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };
  public attendanceChartType: ChartType = 'line';

  // Individual Student Chart
  public studentAttChartData: ChartConfiguration['data'] = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{ data: [100, 80, 100, 90], label: 'Attendance %', borderColor: '#b59b13', tension: 0.3 }]
  };

  switchTab(tab: any) {
    this.activeTab = tab;
    this.successMessage = '';
    this.selectedStudent = null;
    this.selectedTeacher = null;
    this.viewMode = 'list';
    this.teacherViewMode = 'list';
  }

  handleRegisterTeacher() {
    if (!this.newTeacher.email || !this.newTeacher.name) return;
    this.isProcessing = true;
    this.successMessage = '';
    
    const obs = this.isEditingTeacher 
      ? this.api.updateTeacher(this.editingTeacherId, this.newTeacher)
      : this.api.registerTeacher(this.newTeacher);

    obs.subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.successMessage = this.isEditingTeacher ? 'Staff updated successfully!' : 'Staff registered successfully! Credentials sent to email.';
        setTimeout(() => {
          this.resetTeacherForm();
          this.refreshData();
        }, 1500);
      },
      error: (err) => {
        this.isProcessing = false;
        const msg = err.error?.message || 'Failed to process staff';
        alert(`Error: ${msg}`);
      }
    });
  }

  handleEditTeacher(teacher: any) {
    this.isEditingTeacher = true;
    this.editingTeacherId = teacher.id;
    this.teacherViewMode = 'form';
    this.newTeacher = {
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      salary: teacher.salary,
      joiningDate: teacher.joiningDate,
      attendance: teacher.attendance
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleViewTeacher(teacher: any) {
    this.selectedTeacher = {
      ...teacher,
      salaryHistory: [
        { date: '2026-04-01', amount: teacher.salary, txnId: 'UDCS-SAL-8821' },
        { date: '2026-03-01', amount: teacher.salary, txnId: 'UDCS-SAL-7734' }
      ]
    };
  }

  resetTeacherForm() {
    this.isEditingTeacher = false;
    this.editingTeacherId = '';
    this.teacherViewMode = 'list';
    this.successMessage = '';
    this.newTeacher = { name: '', email: '', subject: '', salary: 0 };
  }

  showAddTeacher() {
    this.resetTeacherForm();
    this.teacherViewMode = 'form';
  }

  handleRegisterStudent() {
    // Validation
    const s = this.newStudent;
    if (!s.name || !s.email || !s.className || !s.section || !s.aadharId || !s.contactNo || !s.dob) {
      alert('Please fill all mandatory fields: Name, Email, Class, Section, Aadhar ID, Mobile, and DOB.');
      return;
    }

    // Aadhar Validation (12 digits)
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(s.aadharId)) {
      alert('Invalid Aadhar ID. It must be exactly 12 numeric digits.');
      return;
    }

    // Mobile Validation (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(s.contactNo)) {
      alert('Invalid Contact Number. It must be exactly 10 numeric digits.');
      return;
    }

    // DOB Validation (3 years min)
    if (s.dob && s.dob > this.maxDob) {
      alert('Student must be at least 3 years old (DOB is too recent).');
      return;
    }

    this.isProcessing = true;
    this.successMessage = '';

    const obs = this.isEditing 
      ? this.api.updateStudent(this.editingId, s)
      : this.api.registerStudent(s);

    obs.subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.successMessage = this.isEditing ? 'Student updated successfully!' : 'Student enrolled successfully!';
        setTimeout(() => {
          this.resetStudentForm();
          this.refreshData();
        }, 1500);
      },
      error: (err) => {
        this.isProcessing = false;
        const msg = err.error?.message || 'Failed to process student';
        alert(`Error: ${msg}`);
      }
    });
  }

  handleEditStudent(student: any) {
    this.isEditing = true;
    this.editingId = student.id;
    this.viewMode = 'form';
    this.newStudent = {
      name: student.name,
      email: student.email,
      className: student.className,
      section: student.section,
      dob: student.dob,
      gender: student.gender,
      fatherName: student.fatherName,
      motherName: student.motherName,
      aadharId: student.aadharId,
      bloodGroup: student.bloodGroup,
      admissionDate: student.admissionDate,
      contactNo: student.contactNo,
      address: student.address
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetStudentForm() {
    this.isEditing = false;
    this.editingId = '';
    this.viewMode = 'list';
    this.successMessage = '';
    this.newStudent = { 
      name: '', email: '', className: '1', section: '1', 
      dob: '', gender: '', fatherName: '', motherName: '',
      aadharId: '', bloodGroup: '', admissionDate: '',
      contactNo: '', address: '' 
    };
  }

  showAddStudent() {
    this.resetStudentForm();
    this.viewMode = 'form';
  }

  refreshData() {
    this.api.getAdminData().subscribe(data => {
      this.data = data;
      this.financeChartData.datasets[0].data = [
        data.totalFeesCollected || 0,
        data.pendingFees || 0
      ];
      // Force chart update by creating a new reference
      this.financeChartData = { ...this.financeChartData };
    });

    this.api.getCirculars().subscribe(data => this.circulars = data);
    this.api.getContactInquiries().subscribe(data => this.contacts = data);
  }

  handleCreateCircular() {
    if (!this.newCircular.title || !this.newCircular.content) return;
    this.isProcessing = true;
    this.api.createCircular(this.newCircular).subscribe(() => {
      this.isProcessing = false;
      this.newCircular = { title: '', content: '', targetAudience: 'All', category: 'Notice' };
      this.refreshData();
    });
  }

  handleDeleteCircular(id: string) {
    if (confirm('Delete this circular?')) {
      this.api.deleteCircular(id).subscribe(() => this.refreshData());
    }
  }

  handleApproveStudent(id: string) {
    this.api.approveStudent(id).subscribe(() => {
      const student = this.data.students.find(s => s.id === id);
      if (student) student.status = 'active';
      this.refreshData();
    });
  }

  handleRejectStudent(id: string) {
    if (confirm('Are you sure you want to reject this registration?')) {
      this.api.updateStudent(id, { status: 'rejected' }).subscribe(() => {
        const student = this.data.students.find(s => s.id === id);
        if (student) student.status = 'rejected';
        this.refreshData();
      });
    }
  }

  get pendingStudents() {
    return this.data.students.filter(s => s.status === 'pending');
  }

  get activeStudents() {
    return this.data.students.filter(s => s.status === 'active');
  }

  handleViewStudent(student: SchoolStudent) {
    this.selectedStudent = student;
  }

  handlePaySalary(teacherId: string, amount: number) {
    this.isProcessing = true;
    this.api.processSalary(teacherId, amount).subscribe(() => {
      this.isProcessing = false;
      alert('Salary processed for ' + teacherId);
    });
  }
}
