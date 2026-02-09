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

  oldpassword = '';
  newpassword = '';
  confpassword = '';

  // =========================
  // INIT → FETCH USER FROM DB
  // =========================
  ngOnInit(): void {
    const authUser = this.auth.getUser();
    if (!authUser) return;

    const formData = new FormData();
    formData.append('userId', authUser.userId);

    this.http.post<any>(
      'http://localhost/contentpostingappapis/users/getById.php',
      formData
    ).subscribe({
      next: (res) => {
        if (res?.status === 200 && res.user) {
          this.user.name = res.user.username;
          this.user.email = res.user.email;
          this.user.profile_picture =
            `http://localhost/contentpostingappapis/${res.user.profile_picture}`;
        }
      },
      error: () => {
        alert('Failed to load user details');
      }
    });
  }

  // ==========
  // TAB SWITCH
  // ==========
  setTab(tab: 'profile' | 'account' | 'security') {
    this.activeTab = tab;
  }

  // =================
  // CHANGE USERNAME
  // =================
  changeUsername() {
    const authUser = this.auth.getUser();
    if (!authUser) return;

    const formData = new FormData();
    formData.append('userId', authUser.userId);
    formData.append('username', this.user.name);

    this.http.post<any>(
      'http://localhost/contentpostingappapis/editprofile/write.php',
      formData
    ).subscribe({
      next: (res) => {
        if (res?.status === 200) {
          // keep localStorage in sync
          authUser.username = this.user.name;
          this.auth.setUser(authUser);

          alert(res.message);
        } else {
          alert(res.message || 'Username update failed');
        }
      },
      error: () => {
        alert('Failed to update username');
      }
    });
  }

  // =================
  // CHANGE PASSWORD
  // =================
  changePassword() {
    const authUser = this.auth.getUser();
    if (!authUser) return;

    if (!this.oldpassword || !this.newpassword) {
      alert('Please fill all password fields');
      return;
    }

    const formData = new FormData();
    formData.append('userId', authUser.userId);
    formData.append('oldPassword', this.oldpassword);
    formData.append('password', this.newpassword);

    this.http.post<any>(
      'http://localhost/contentpostingappapis/editprofile/write.php',
      formData
    ).subscribe({
      next: (res) => {
        alert(res.message);
        this.oldpassword = '';
        this.newpassword = '';
        this.confpassword = '';
      },
      error: () => {
        alert('Failed to update password');
      }
    });
  }

  // =================
  // SAVE BUTTON LOGIC
  // =================
  saveChanges() {
    if (this.activeTab === 'profile') {
      this.changeUsername();
    }

    if (this.activeTab === 'security') {
      this.changePassword();
    }
  }
}
