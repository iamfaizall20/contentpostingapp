import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  username: string = '';
  password: string = '';

  apiUrl = "http://localhost/contentpostingappapis/auth/login.php";

  constructor(private http: HttpClient, private router: Router) { }

  onsubmit(form: NgForm) {
    if (this.username.trim() === '' || this.password.trim() === '') {
      alert("Please fill all the fields");
      return;
    }

    const body = {
      username: this.username,
      password: this.password
    };

    this.http.post(this.apiUrl, body).subscribe({
      next: (res: any) => {
        if (res && res.status === 200) {
          alert("Login Successful");
          this.router.navigate(['/home']);
        } else {
          alert(res.message || 'Login failed');
        }
      },
      error: (err: any) => {
        if (err.status == 401) {
          alert("User Not Found");
        } else if (err.status == 500) {
          alert("Server Error");
        } else {
          alert("Failed to login! Try again");
        }
      }
    });
  }
}
