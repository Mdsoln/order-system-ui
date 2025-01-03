import { CommonModule, NgIf } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  signupSuccess: boolean = false;
  signupError: boolean = false;
  isSubmitted: boolean = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.confirmPasswordValidator 
    });    
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.isSubmitted = true;
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.signupSuccess = true;
          alert('Signup successful!');
          this.signupForm.reset();
          this.isSubmitted = false;
          // Navigate to login page after success
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.signupError = true;
          console.error('Signup failed: ', err.message || err);
        },
      });
    } else {
      this.signupError = true; // Form validation failed
    }
  }
  
  getFieldError(fieldName: string): string | null {
    const control = this.signupForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength}`;
    }
    return null;
  }

  confirmPasswordValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  
}
