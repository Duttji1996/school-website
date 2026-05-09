import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentApiService, StudentDashboardData } from '../../../../services/student-api.service';

@Component({
  selector: 'app-fees',
  imports: [CommonModule, FormsModule],
  templateUrl: './fees.component.html',
  styleUrl: './fees.component.css'
})
export class FeesComponent {
  private studentApi = inject(StudentApiService);
  
  @Input() data!: StudentDashboardData;
  @Input() paymentAmount: number = 0; // Receive default amount

  showPaymentModal = false;
  isProcessingPayment = false;
  paymentSuccessMessage = '';

  openPaymentModal() {
    this.showPaymentModal = true;
    this.paymentSuccessMessage = '';
    // If payment amount is 0, default it to pending amount
    if (this.paymentAmount === 0 && this.data) {
      this.paymentAmount = this.data.feeDetails.pendingAmount;
    }
  }

  closePaymentModal() {
    if (!this.isProcessingPayment) {
      this.showPaymentModal = false;
    }
  }

  processPayment(event: Event) {
    event.preventDefault();
    if (!this.data || this.paymentAmount <= 0) return;

    this.isProcessingPayment = true;
    
    this.studentApi.submitFeePayment(this.data.studentId, this.paymentAmount).subscribe({
      next: (response) => {
        if (response.success) {
          this.isProcessingPayment = false;
          this.paymentSuccessMessage = `Payment of ₹${this.paymentAmount} successful! (Txn: ${response.transactionId})`;
          
          // Optimistically update local data
          if (this.data) {
            this.data.feeDetails.pendingAmount -= this.paymentAmount;
            this.data.feeDetails.paidAmount += this.paymentAmount;
            // Add to top of history
            this.data.paymentHistory.unshift({
              receiptNo: response.transactionId,
              date: new Date().toISOString().split('T')[0],
              amount: this.paymentAmount,
              method: 'Online Processing'
            });
          }
          
          // Auto close after 3 seconds
          setTimeout(() => {
            this.closePaymentModal();
            this.paymentSuccessMessage = '';
          }, 3000);
        }
      },
      error: () => {
        this.isProcessingPayment = false;
        alert('Payment processing failed. Please try again.');
      }
    });
  }
}
