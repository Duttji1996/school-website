import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  selectedCategory = 'All';
  categories = ['All', 'Academic', 'Campus', 'Events'];

  allImages = [
    { url: '/assets/images/hero.png', title: 'Interactive Learning', category: 'Academic' },
    { url: '/assets/images/building_v2.png', title: 'World-Class Campus', category: 'Campus' },
    { url: '/assets/images/arena_v2.png', title: 'Modern Sports Arena', category: 'Events' },
    { url: '/assets/images/lab_v2.png', title: 'Innovation & Tech Lab', category: 'Campus' },
    { url: '/assets/images/about.png', title: 'Knowledge Hub', category: 'Campus' },
    { url: '/assets/images/teacher.png', title: 'Personalized Attention', category: 'Academic' },
    { url: '/assets/image/vikas_dutt.png', title: 'Leadership in Action', category: 'Events' },
    { url: '/assets/images/writing.png', title: 'Creative Workshop', category: 'Academic' },
    { url: '/assets/images/reading.png', title: 'Library Session', category: 'Academic' },
    { url: '/assets/image/grand_opening_v3.png', title: 'Grand Opening Preview', category: 'Events' },
    { url: '/assets/images/computers.png', title: 'IT Literacy Program', category: 'Academic' }
  ];

  get filteredImages() {
    if (this.selectedCategory === 'All') return this.allImages;
    return this.allImages.filter(img => img.category === this.selectedCategory);
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
  }
}
