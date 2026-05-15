import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolApiService } from '../../services/school-api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(SchoolApiService);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
    subject: ['', [Validators.required, Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.maxLength(2000)]]
  });

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitError = '';
      
      this.apiService.sendContactMessage(this.contactForm.value).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.contactForm.reset();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.submitError = err.error?.message || 'Something went wrong. Please try again later.';
          console.error('Contact form error:', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.contactForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
