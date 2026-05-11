import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentDashboardData } from '../../../../services/school-api.service';
import { NoDataComponent } from '../../../../components/no-data/no-data.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, NoDataComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  @Input() data!: StudentDashboardData;
  weekDays: { date: Date; status?: string; dayNum: number }[] = [];

  ngOnInit() {
    this.generateWeekView();
  }

  generateWeekView() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const attendance = this.data?.attendanceDetails?.find(a => a.date === dateStr);
      this.weekDays.push({
        date,
        dayNum: date.getDate(),
        status: attendance?.status || (date.getDay() === 0 ? 'sunday' : undefined)
      });
    }
  }
}
