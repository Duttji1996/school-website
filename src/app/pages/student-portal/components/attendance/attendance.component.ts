import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StudentDashboardData, AttendanceDetail, Holiday } from '../../../../services/school-api.service';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  status?: 'present' | 'absent' | 'holiday' | 'sunday';
  holidayName?: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit {
  @Input() data!: StudentDashboardData;

  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    this.calendarDays = [];

    // Add days from previous month to fill the first row
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      this.calendarDays.push({ date, isCurrentMonth: false });
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = this.formatDate(date);
      
      let status: 'present' | 'absent' | 'holiday' | 'sunday' | undefined;
      let holidayName: string | undefined;

      // Check for Sunday
      if (date.getDay() === 0) {
        status = 'sunday';
      }

      // Check for attendance details
      const attendance = this.data.attendanceDetails.find(a => a.date === dateString);
      if (attendance) {
        status = attendance.status;
      }

      // Check for holiday calendar
      const holiday = this.data.holidayCalendar.find(h => h.date === dateString);
      if (holiday) {
        status = 'holiday';
        holidayName = holiday.name;
      }

      this.calendarDays.push({ date, isCurrentMonth: true, status, holidayName });
    }

    // Add days from next month to fill the last row
    const remainingDays = 42 - this.calendarDays.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push({ date, isCurrentMonth: false });
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  get monthName(): string {
    return this.currentDate.toLocaleString('default', { month: 'long' });
  }

  get year(): number {
    return this.currentDate.getFullYear();
  }
}
