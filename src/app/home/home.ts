import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { Loader } from "../loader/loader";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    Navbar
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  apiURL = 'http://localhost/contentpostingappapis/posts/lists.php';

  posts: any[] = [];
  postText = '';

  isLoggedIn = false;
  currentUser: any = null;

  trendingTopics = ['Web Development', 'Startups', 'AI'];
  trendingTags = ['angular', 'javascript', 'frontend', 'ai'];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.checkAuth();
    this.loadPosts();
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

  loadPosts() {
    this.http.get(this.apiURL).subscribe((res: any) => {
      if (res.status === 200) {
        this.posts = res.posts.map((post: any) => ({
          ...post,
          cover_image: this.getFullImageUrl(post.cover_image),
          timeAgo: this.calculateTimeAgo(post.created_at)
        }));
      }
    });
  }

  savePost(post_id: number) {
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('User not found in localStorage');
      return;
    }

    const user = JSON.parse(userString);

    const formData = new FormData();
    formData.append('userId', user.userId.toString());
    formData.append('post_id', post_id.toString());

    this.http.post("http://localhost/contentpostingappapis/savedposts/create.php", formData)
      .subscribe({
        next: () => {
          alert("Post Saved Successfully");
        },
        error: (err) => {
          console.error('Error saving post:', err);
        }
      });
  }


  publishPost() {
    if (!this.postText.trim()) return;
    console.log('Publish:', this.postText);
    this.postText = '';
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

}
