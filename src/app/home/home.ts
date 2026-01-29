import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  posts = [
    {
      title: 'Getting Started with Angular in 2026',
      excerpt:
        'Angular is still one of the most powerful frameworks for building scalable web applications...',
      coverImage: 'https://picsum.photos/800/300?random=1',
      author: 'Faizal Hassan',
      timeAgo: '3 hours ago',
      tags: ['angular', 'webdev', 'frontend']
    },
    {
      title: 'Why Developers Prefer Minimal UI',
      excerpt:
        'Minimal UI helps developers focus on content and usability instead of distractions...',
      coverImage: 'https://picsum.photos/800/300?random=2',
      author: 'Ayesha Noor',
      timeAgo: '6 hours ago',
      tags: ['uiux', 'design']
    }
  ];

  trendingTopics = ['Web Development', 'Startups', 'AI'];

  trendingTags = ['angular', 'javascript', 'frontend', 'ai'];
}
