import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-newpost',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
  templateUrl: './newpost.html',
  styleUrl: './newpost.css',
})
export class Newpost {
  tags: string[] = [];
  coverPreview: string | null = null;

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
}
