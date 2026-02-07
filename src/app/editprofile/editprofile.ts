import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar],
  templateUrl: './editprofile.html',
  styleUrl: './editprofile.css',
})
export class Editprofile {

  activeTab: 'profile' | 'account' | 'security' = 'profile';

  // Dummy user (replace with API later)
  user = {
    name: 'John Doe',
    email: 'john@example.com',
    profile_picture: 'https://i.pravatar.cc/150?img=3'
  };

  setTab(tab: 'profile' | 'account' | 'security') {
    this.activeTab = tab;
  }
}