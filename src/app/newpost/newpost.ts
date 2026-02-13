import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Notification } from '../notification/notification';
import { NotificationService } from '../services/notification-service/notification-service';


@Component({
  selector: 'app-newpost',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, Navbar, Notification],
  templateUrl: './newpost.html',
  styleUrl: './newpost.css',
})
export class Newpost {

  apiURL = "http://localhost/contentpostingappapis/posts/create.php";

  tags: string[] = [];
  coverPreview: string | null = null;
  coverFile: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  addTag(event: any) {
    event.preventDefault();
    const value = event.target.value.trim();

    if (!value) return;

    if (this.tags.length >= 5) {
      this.notificationService.info('Maximum 5 tags allowed');
      return;
    }

    if (this.tags.includes(value)) {
      this.notificationService.info('Tag already added');
      return;
    }

    this.tags.push(value);
    event.target.value = '';
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  onCoverUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.notificationService.error('Please upload a valid image file (JPG, PNG, WEBP)');
      return;
    }
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.notificationService.error('Image size must be less than 5MB');
      return;
    }

    this.coverFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.coverPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeCover() {
    this.coverPreview = null;
    this.coverFile = null;
  }

  publishPost(form: any) {
    if (!form.value.title || !form.value.content) {
      this.notificationService.error('Please fill all required fields');
      return;
    }

    const userString = localStorage.getItem('user');
    if (!userString) {
      this.notificationService.error('Please log in to create a post');
      return;
    }

    const formData = new FormData();
    const user = JSON.parse(userString);

    formData.append('userId', user.userId);
    formData.append('title', form.value.title);
    formData.append('content', form.value.content);

    this.tags.forEach(tag => {
      formData.append('tags[]', tag);
    });

    if (this.coverFile) {
      formData.append('cover_image', this.coverFile);
    }

    this.http.post(this.apiURL, formData).subscribe({
      next: (res: any) => {
        this.notificationService.success('Post published successfully');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: err => {
        this.notificationService.error('Failed to publish post. Please try again');
      }
    });
  }
}