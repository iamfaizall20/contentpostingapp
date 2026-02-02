import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private router: Router) { }

  isLoggedIn = false;
  openDropdown = false;
  currentUser: any = null;

  ngOnInit() {
    this.checkAuth();
  }

  checkAuth() {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.currentUser.profile_picture =
        `http://localhost/contentpostingappapis/${this.currentUser.profile_picture}`;
      this.isLoggedIn = true;
    }
  }

  toggleDropdown() {
    this.openDropdown = !this.openDropdown;
  }

  logout() {
    localStorage.removeItem('user');
    this.openDropdown = false;
    this.router.navigate(['/login']);
  }
}
