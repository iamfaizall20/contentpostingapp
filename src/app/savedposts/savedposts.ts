import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Loader } from '../loader/loader';
import { Notification } from '../notification/notification';
import { NotificationService } from '../services/notification-service/notification-service';

@Component({
  selector: 'app-savedposts',
  imports: [Navbar, Loader, HttpClientModule, CommonModule, RouterLink, Notification],
  templateUrl: './savedposts.html',
  styleUrl: './savedposts.css',
})
export class Savedposts {

  posts: any[] = []
  APIurl = "http://localhost/contentpostingappapis/savedposts/read.php";
  isLoading: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadposts();
  }

  loadposts() {
    const userString = localStorage.getItem('user');

    if (!userString) {
      this.notificationService.error('Please log in to view saved posts');
      this.isLoading = false;
      return;
    }

    const user = JSON.parse(userString);

    const formData = new FormData();
    formData.append('userId', user.userId);

    this.http.post(this.APIurl, formData).subscribe({
      next: (res: any) => {
        if (res) {
          this.posts = res.saved_posts.map((post: any) => ({
            ...post,
            cover_image: this.getFullImageUrl(post.cover_image),
            timeAgo: this.calculateTimeAgo(post.created_at)
          }));
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        this.notificationService.error('Failed to load saved posts');
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

}