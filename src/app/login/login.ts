import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { Notification } from '../notification/notification';
import { NotificationService } from '../services/notification-service/notification-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, HttpClientModule, Notification],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  username: string = '';
  password: string = '';

  apiUrl = "http://localhost/contentpostingappapis/auth/login.php";

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: Auth,
    private notificationService: NotificationService
  ) { }

  onsubmit(form: NgForm) {
    if (this.username.trim() === '' || this.password.trim() === '') {
      this.notificationService.error("Please fill all the fields");
      return;
    }

    const body = {
      username: this.username,
      password: this.password
    };

    this.http.post(this.apiUrl, body).subscribe({
      next: (res: any) => {
        if (res && res.status === 200) {
          this.notificationService.success("Login Successful");
          this.auth.setUser(res.user);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 500);
        } else {
          this.notificationService.error(res.message || 'Login failed');
        }
      },
      error: (err: any) => {
        if (err.status == 401) {
          this.notificationService.error("User Not Found");
        } else if (err.status == 500) {
          this.notificationService.error("Server Error");
        } else {
          this.notificationService.error("Failed to login! Try again");
        }
      }
    });
  }
}