import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SchoolApiService, AdminDashboardData, SchoolTeacher, SchoolStudent } from '../../../../services/school-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  @Input() data!: AdminDashboardData;
  private api = inject(SchoolApiService);

  activeTab: 'overview' | 'pending' | 'students' | 'teachers' | 'fees' | 'payroll' = 'overview';
  selectedStudent: any = null;
  viewMode: 'list' | 'form' = 'list';
  isEditing = false;
  editingId = '';
  
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
  }

  setMaxDob() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 3);
    this.maxDob = today.toISOString().split('T')[0];
  }
  
  isProcessing = false;
  successMessage = '';

  switchTab(tab: any) {
    this.activeTab = tab;
    this.successMessage = '';
  }

  handleRegisterTeacher() {
    if (!this.newTeacher.email || !this.newTeacher.name) return;
    this.isProcessing = true;
    this.successMessage = '';
    
    this.api.registerTeacher(this.newTeacher).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.successMessage = 'Staff registered successfully! Credentials sent to email.';
        this.newTeacher = { name: '', email: '', subject: '', salary: 0 };
        this.refreshData(); // Refresh list
      },
      error: (err) => {
        this.isProcessing = false;
        const msg = err.error?.message || 'Failed to register staff';
        alert(`Error: ${msg}`);
      }
    });
  }

  handleRegisterStudent() {
    // Validation
    const s = this.newStudent;
    if (!s.name || !s.email || !s.className || !s.section || !s.aadharId || !s.contactNo || !s.dob) {
      alert('Please fill all mandatory fields: Name, Email, Class, Section, Aadhar ID, Mobile, and DOB.');
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
    });
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
