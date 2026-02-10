import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Loader } from '../loader/loader';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-viewpost',
  standalone: true,
  imports: [Navbar, Loader, CommonModule, HttpClientModule, RouterLink],
  templateUrl: './viewpost.html',
  styleUrls: ['./viewpost.css'],
})
export class Viewpost {

  apiURL = 'http://localhost/contentpostingappapis/readpost/read.php';
  likeApiURL = 'http://localhost/contentpostingappapis/likes/toggle.php';

  isLoading = true;
  postId!: number;

  post: any = {};
  user: any = {};
  morePosts: any[] = [];

  isLiked = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private auth: Auth
  ) { }

  ngOnInit() {
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));
    this.fetchDetails();
  }

  fetchDetails() {
    const user = this.auth.getUser();
    if (!user) return;

    const formData = new FormData();
    formData.append('userId', user.userId);
    formData.append('postId', this.postId.toString());

    this.http.post(this.apiURL, formData).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.processResponse(res.data);
          // keep your countLikes() call if you want to refresh likes separately
          this.countLikes();
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to fetch post details:', err);
        this.isLoading = false;
      }
    });
  }

  processResponse(data: any) {
    const post = data.post;

    this.post = {
      id: post.id,
      title: post.title,
      username: post.username,
      content: post.content,
      coverImage: this.getFullImageUrl(post.cover_image),
      postedAgo: this.calculateTimeAgo(post.created_at),
      likes: data.meta.likesCount,
      saves: data.meta.savesCount,
      tags: post.tags || []
    };

    // important: update isLiked for HTML button
    this.isLiked = data.meta.isLiked ?? false;

    const author = data.author;
    this.user = {
      username: author.username,
      profilePic: this.getFullImageUrl(author.profile_picture),
      followers: data.meta.followersCount,
      following: data.meta.isFollowing ? 1 : 0,
      totalPosts: data.morePosts.length
    };

    this.morePosts = data.morePosts.map((p: any) => ({
      ...p,
      tags: p.tags || []
    }));
  }

  toggleLike() {
    const user = this.auth.getUser();
    if (!user) return;

    const formData = new FormData();
    formData.append('userId', user.userId);
    formData.append('postId', this.postId.toString());

    this.http.post(this.likeApiURL, formData).subscribe({
      next: (res: any) => {
        this.isLiked = res.liked;
        this.post.likes = res.count;
      },
      error: (err) => {
        console.error('Like toggle failed:', err);
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

  countLikes() {
    const formData = new FormData();
    formData.append('postId', this.postId.toString());

    this.http.post<{ status: number, count: number }>(
      'http://localhost/contentpostingappapis/likes/count.php',
      formData
    ).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.post.likes = res.count;
        }
      },
      error: (err) => {
        console.error('Failed to fetch like count:', err);
      }
    });
  }

}
