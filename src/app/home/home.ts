import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, HttpClientModule, RouterOutlet],
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  apiURL = "http://localhost/contentpostingappapis/posts/lists.php";
  posts: any[] = [];

  trendingTopics = ['Web Development', 'Startups', 'AI'];
  trendingTags = ['angular', 'javascript', 'frontend', 'ai'];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.http.get(this.apiURL).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          // Process posts to add full cover_image URL and timeAgo string
          this.posts = res.posts.map((post: any) => ({
            ...post,
            cover_image: this.getFullImageUrl(post.cover_image),
            timeAgo: this.calculateTimeAgo(post.created_at)
          }));
        }
      },
      error: (err) => {
        console.error('Failed to load posts', err);
      }
    });
  }

  // Helper to get full URL for cover images
  getFullImageUrl(path: string): string {
    // If backend returns relative path like "uploads/posts/abc.jpg"
    return `http://localhost/contentpostingappapis/${path}`;
  }

  // Calculate "time ago" string from timestamp
  calculateTimeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(days / 365);
    return `${years} years ago`;
  }
}
