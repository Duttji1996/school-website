import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="no-data-container">
      <div class="icon-circle">
        <i [class]="icon"></i>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .no-data-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 16px;
      border: 2px dashed #e2e8f0;
      margin: 1rem 0;
    }
    .icon-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      color: #94a3b8;
      font-size: 2.5rem;
      border: 1px solid #e2e8f0;
    }
    h3 {
      margin: 0 0 0.5rem 0;
      color: #1e293b;
      font-weight: 700;
    }
    p {
      margin: 0;
      color: #64748b;
      font-size: 0.95rem;
      max-width: 300px;
    }
  `]
})
export class NoDataComponent {
  @Input() icon: string = 'pi pi-folder-open';
  @Input() title: string = 'No Data Found';
  @Input() message: string = 'We couldn\'t find any records to display at this moment.';
}
