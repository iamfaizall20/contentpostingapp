import { Component, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-myposts',
  imports: [Navbar, CommonModule, HttpClientModule],
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
          this.posts = res.myposts;
        }
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
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
