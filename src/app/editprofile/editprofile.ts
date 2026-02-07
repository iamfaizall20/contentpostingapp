import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, HttpClientModule],
  templateUrl: './editprofile.html',
  styleUrl: './editprofile.css',
})
export class Editprofile {

  constructor(private http: HttpClient) { }
  username: string = '';
  newpassword: string = '';
  oldpassword: string = '';

  activeTab: 'profile' | 'account' | 'security' = 'profile';

  user = {
    name: 'John Doe',
    email: 'john@example.com',
    profile_picture: 'https://i.pravatar.cc/150?img=3'
  };

  setTab(tab: 'profile' | 'account' | 'security') {
    this.activeTab = tab;
  }

  changeUsername() {
    const user = JSON.parse(localStorage.getItem('user')!);

    const formData = new FormData();

    formData.append('userId', user.userId);
    formData.append('username', this.username);

    this.http.post('http://localhost/contentpostingappapis/editprofile/write.php', formData).subscribe({
      next: (res: any) => {
        if (res) {
          alert(res.message);
        }
      },
      error: (err: any) => {
        alert(err.message);
      }
    })

  }
  changePassword() {
    const user = JSON.parse(localStorage.getItem('user')!);

    const formData = new FormData();

    formData.append('userId', user.userId);
    formData.append('username', this.username);
    formData.append('password', this.newpassword);
    formData.append('oldpassword', this.oldpassword);

    this.http.post('http://localhost/contentpostingappapis/editprofile/write.php', formData).subscribe({
      next: (res: any) => {
        if (res) {
          alert(res.message);
        }
      },
      error: (err: any) => {
        alert(err.message);
      }
    })

  }

  saveChanges() {
    if (this.activeTab === 'profile') {
      this.changeUsername();
    }
  }
}