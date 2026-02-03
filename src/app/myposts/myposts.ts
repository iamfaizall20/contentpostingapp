import { Component, NgModule, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-myposts',
  imports: [Navbar, CommonModule, HttpClientModule, RouterLink],
  templateUrl: './myposts.html',
  styleUrl: './myposts.css',
})
export class Myposts implements OnInit {

  apiUrl = "http://localhost/contentpostingappapis/myposts/read.php";
  posts: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.userId) {
      console.error('User not logged in');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.userId);

    this.http.post(this.apiUrl, formData).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.posts = res.myposts.map((post: any) => ({
            ...post,
            cover_image: this.getFullImageUrl(post.cover_image),
            timeAgo: this.calculateTimeAgo(post.created_at)
          }));
          console.log(this.posts);
        }
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }


  getFullImageUrl(path: string): string {
    return `http://localhost/contentpostingappapis/${path}`;
  }

  calculateTimeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }


  onRead(post: any) {
    // navigate to post details
  }

  onBookmark(post: any) {
    // bookmark logic
  }

  onCreatePost() {
    // navigate to create post
  }
}
