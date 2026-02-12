import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    Navbar,
    Sidebar,
    Loader
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  apiURL = 'http://localhost/contentpostingappapis/posts/lists.php';

  posts: any[] = [];
  activeTab: string = 'discover';

  isLoggedIn = false;
  isLoading = true;
  currentUser: any = null;

  trendingTopics = ['Web Development', 'Startups', 'AI'];
  trendingTags = ['angular', 'javascript', 'frontend', 'ai'];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.checkAuth();
    this.loadPosts('discover'); // default tab
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

  /* ================================
     TAB CHANGE
  ================================= */

  changeTab(type: string) {

    if (this.activeTab === type) return;

    this.activeTab = type;
    this.loadPosts(type);
  }

  /* ================================
     LOAD POSTS FROM API
  ================================= */

  loadPosts(type: string) {
    this.isLoading = true;

    let url = `${this.apiURL}?type=${type}`;

    if (type === 'following' && this.currentUser) {
      url += `&user_id=${this.currentUser.userId}`;
    }

    this.http.get(url).subscribe((res: any) => {

      if (res.status === 200) {
        this.posts = res.posts.map((post: any) => ({
          ...post,
          cover_image: this.getFullImageUrl(post.cover_image),
          timeAgo: this.calculateTimeAgo(post.created_at)
        }));
        setTimeout(() => {
          this.isLoading = false;
        }, 200);
      }
    });
  }

  /* ================================
     SAVE POST (UNCHANGED)
  ================================= */

  toggleSave(post: any) {

    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);

    const formData = new FormData();
    formData.append('userId', user.userId);
    formData.append('post_id', post.id);

    this.http.post(
      "http://localhost/contentpostingappapis/savedposts/create.php",
      formData
    ).subscribe((res: any) => {
      post.isSaved = res.saved;
    });
  }

  /* ================================
     HELPERS (UNCHANGED)
  ================================= */

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

  onReadMore(postId: number) {
    this.router.navigate(['/viewpost', postId]);
  }

}
