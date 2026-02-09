import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, HttpClientModule],
  templateUrl: './editprofile.html',
  styleUrl: './editprofile.css',
})
export class Editprofile implements OnInit {

  constructor(
    private http: HttpClient,
    private auth: Auth
  ) { }

  activeTab: 'profile' | 'account' | 'security' = 'profile';

  user = {
    name: '',
    email: '',
    profile_picture: ''
  };

  newpassword = '';
  oldpassword = '';

  ngOnInit() {
    const authUser = this.auth.getUser();

    if (!authUser) return;

    this.user.name = authUser.username;
    this.user.email = authUser.email;
    this.user.profile_picture =
      `http://localhost/contentpostingappapis/${authUser.profile_picture}`;
  }

  setTab(tab: 'profile' | 'account' | 'security') {
    this.activeTab = tab;
  }

  changeUsername() {
    const authUser = this.auth.getUser();
    if (!authUser) return;

    const formData = new FormData();
    formData.append('userId', authUser.userId);
    formData.append('username', this.user.name);

    this.http.post(
      'http://localhost/contentpostingappapis/editprofile/write.php',
      formData
    ).subscribe({
      next: (res: any) => {
        if (res?.status === 200) {

          authUser.username = this.user.name;
          this.auth.setUser(authUser);

          alert(res.message);
        }
      },
      error: () => alert('Failed to update username')
    });
  }

  changePassword() {
    const authUser = this.auth.getUser();
    if (!authUser) return;

    const formData = new FormData();
    formData.append('userId', authUser.userId);
    formData.append('oldpassword', this.oldpassword);
    formData.append('password', this.newpassword);

    this.http.post(
      'http://localhost/contentpostingappapis/editprofile/write.php',
      formData
    ).subscribe({
      next: (res: any) => alert(res.message),
      error: () => alert('Failed to update password')
    });
  }

  saveChanges() {
    if (this.activeTab === 'profile') {
      this.changeUsername();
    } else if (this.activeTab === 'security') {
      this.changePassword();
    }
  }
}
