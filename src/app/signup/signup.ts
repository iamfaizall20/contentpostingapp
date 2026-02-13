import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Notification } from '../notification/notification';
import { NotificationService } from '../services/notification-service/notification-service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, HttpClientModule, CommonModule, Notification],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup {

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  apiUrl = "http://localhost/contentpostingappapis/auth/signup.php";

  constructor(private http: HttpClient, private router: Router, private notificationService: NotificationService) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.notificationService.info("Please fill all required fields correctly");
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notificationService.error("Passwords do not match");
      return;
    }

    const body = {
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.http.post<any>(this.apiUrl, body).subscribe({
      next: (res) => {
        if (res && res.status === 201) {
          this.notificationService.success("Signup successful");
          this.router.navigate(['/login']);
        } else {
          alert(res.message || 'Signup failed');
        }
      },
      error: (err) => {
        this.notificationService.error(err.message);
      }
    });
  }
}
