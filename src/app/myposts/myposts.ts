import { Component, NgModule, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Loader } from '../loader/loader';
import { Notification } from '../notification/notification';
import { NotificationService } from '../services/notification-service/notification-service';

@Component({
  selector: 'app-myposts',
  imports: [Navbar, Loader, CommonModule, HttpClientModule, RouterLink, Notification],
  templateUrl: './myposts.html',
  styleUrl: './myposts.css',
})
export class Myposts implements OnInit {

  apiUrl = "http://localhost/contentpostingappapis/myposts/read.php";
  posts: any[] = [];
  isLoading: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.userId) {
      this.notificationService.error('User not logged in');
      this.isLoading = false;
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
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.notificationService.error('Failed to load posts');
        this.isLoading = false;
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

  onRead(postId: number) {
    this.router.navigate(['/viewpost', postId]);
  }

  toggleSave(postId: any) {
    const userString = localStorage.getItem('user');
    if (!userString) {
      this.notificationService.error('Please log in to save posts');
      return;
    }

    const user = JSON.parse(userString);

    const formData = new FormData();
    formData.append('userId', user.userId);
    formData.append('post_id', postId);

    this.http.post("http://localhost/contentpostingappapis/savedposts/create.php", formData)
      .subscribe({
        next: (res: any) => {
          if (res.saved) {
            this.notificationService.success('Post saved successfully');
          } else {
            this.notificationService.info('Post removed from saved');
          }
        },
        error: (err) => {
          this.notificationService.error('Failed to save post');
        }
      });
  }

  deletePost(postId: any | number) {
    const formData = new FormData();
    formData.append('postId', postId);

    this.http.post('http://localhost/contentpostingappapis/myposts/delete.php', formData).subscribe({
      next: (res: any) => {
        if (res) {
          this.notificationService.success("Post Deleted");
          this.loadPosts();
        }
      },
      error: (err: any) => {
        this.notificationService.error(err.message);
      }
    })
  }
}