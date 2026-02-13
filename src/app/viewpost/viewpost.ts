import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Loader } from '../loader/loader';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { Notification } from '../notification/notification';
import { NotificationService } from '../services/notification-service/notification-service';

@Component({
  selector: 'app-viewpost',
  standalone: true,
  imports: [Navbar, Loader, CommonModule, HttpClientModule, RouterLink, Notification],
  templateUrl: './viewpost.html',
  styleUrls: ['./viewpost.css'],
})
export class Viewpost {

  apiURL = 'http://localhost/contentpostingappapis/readpost/read.php';
  likeApiURL = 'http://localhost/contentpostingappapis/likes/toggle.php';
  followApiURL = 'http://localhost/contentpostingappapis/follows/toggle.php';

  isLoading = true;
  isFollowing = false;
  postId!: number;

  post: any = {};
  user: any = {};
  morePosts: any[] = [];

  isLiked = false;
  isSaved = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private auth: Auth,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));
    this.fetchDetails();
  }

  fetchDetails() {
    const user = this.auth.getUser();
    if (!user) {
      this.notificationService.error('Please log in to view posts');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.userId);
    formData.append('postId', this.postId.toString());

    this.http.post(this.apiURL, formData).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.processResponse(res.data);
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.notificationService.error('Failed to fetch post details');
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
      postOwnerId: post.postOwnerId,
      content: post.content,
      coverImage: this.getFullImageUrl(post.cover_image),
      postedAgo: this.calculateTimeAgo(post.created_at),
      likes: data.meta.likesCount,
      saves: data.meta.savesCount,
      tags: post.tags || []
    };

    // ✅ From API
    this.isLiked = data.meta.isLiked ?? false;
    this.isSaved = data.meta.isSaved ?? false;
    this.isFollowing = data.meta.isFollowing ?? false;

    const author = data.author;

    this.user = {
      username: author.username,
      profilePic: this.getFullImageUrl(author.profile_picture),
      followers: data.meta.followersCount,
      following: data.meta.followingCount,
      totalPosts: data.morePosts.length
    };

    this.morePosts = data.morePosts.map((p: any) => ({
      ...p,
      tags: p.tags || []
    }));
  }

  toggleLike() {
    const user = this.auth.getUser();
    if (!user) {
      this.notificationService.info('Please log in to like posts');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.userId);
    formData.append('postId', this.postId.toString());

    this.http.post(this.likeApiURL, formData).subscribe({
      next: (res: any) => {
        this.isLiked = res.liked;
        this.post.likes = res.count;
        if (res.liked) {
          this.notificationService.success('Post liked');
        } else {
          this.notificationService.info('Post unliked');
        }
      },
      error: (err) => {
        this.notificationService.error('Failed to update like status');
      }
    });
  }

  toggleFollow() {
    const user = this.auth.getUser();
    if (!user) {
      this.notificationService.info('Please log in to follow users');
      return;
    }

    const formData = new FormData();
    formData.append('loggedinUser', user.userId);
    formData.append('postOwner', this.post.postOwnerId);

    this.http.post(this.followApiURL, formData).subscribe({
      next: (res: any) => {
        if (res) {
          this.isFollowing = res.isFollowing;
          this.user.followers = res.followersCount;
          if (res.isFollowing) {
            this.notificationService.success('Successfully followed user');
          } else {
            this.notificationService.info('Unfollowed user');
          }
        }
      },
      error: (err: any) => {
        this.notificationService.error('Failed to update follow status');
      }
    });
  }

  getFullImageUrl(path: string): string {
    if (!path) return '';
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

  toggleSave(postId: any) {
    const user = JSON.parse(localStorage.getItem('user')!);

    if (!user) {
      this.notificationService.info('Please log in to save posts');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.userId);
    formData.append('post_id', postId);

    this.http.post('http://localhost/contentpostingappapis/savedposts/create.php', formData).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.saved) {
            this.notificationService.success('Post saved successfully');
          } else {
            this.notificationService.info('Post removed from saved');
          }
          this.fetchDetails();
        }
      },
      error: (err: any) => {
        this.notificationService.error('Failed to save post');
      }
    });
  }
}