import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-newpost',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink,HttpClientModule],
  templateUrl: './newpost.html',
  styleUrl: './newpost.css',
})
export class Newpost {

  constructor(private http: HttpClient, private router: Router) { }
  apiURL = "http://localhost/contentpostingappapis/posts/create.php";

  tags: string[] = [];
  coverPreview: string | null = null;
  coverFile: any;

  addTag(event: any) {
    event.preventDefault();
    const value = event.target.value.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }
    event.target.value = '';
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  onCoverUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.coverFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.coverPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeCover() {
    this.coverPreview = null;
  }
  generateContentAI() { };
  suggestTitleAI() { };
  suggestTagsAI() { };
  generateCoverAI() { };

  publishPost(form: any) {
    if (!form.value.title || !form.value.content) {
      alert("Please fill all fields");
      return;
    }
  
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem('user')!);
  
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
        alert("Post Added Successfully");
        this.router.navigate(['/']);
      },
      error: err => {
        console.log('Error', err);
      }
    });
  }  
}
