import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sermons',
  templateUrl: './sermons.page.html',
  styleUrls: ['./sermons.page.scss'],
  standalone:false
})
export class SermonsPage implements OnInit, AfterViewInit, OnDestroy {
  showMobileMenu = false;
  sermons = [
    {
      videoUrl: 'https://youtubelinkreplace/embed/eKMOq2js2D0',
      title: "Pastor Mabote | Father's day",
      preacher: 'Pastor Mabote',
      date: '24 Mar 2014'
    },
    {
      videoUrl: 'https://youtubelinkreplace/embed/OCyfEpKvdW8',
      title: 'Ev. Keitumetse Mabote  - Ho tsamaea moeeng',
      preacher: 'Keitumetse Mabote',
      date: '24 Mar 2014'
    },
    {
      videoUrl: 'https://youtubelinkreplace/embed/eKMOq2js2D0',
      title: "Pastor Mabote | Father's day",
      preacher: 'Pastor Mabote',
      date: '24 Mar 2014'
    },
    {
      videoUrl: 'https://youtubelinkreplace/embed/7MCN0MZxl3c',
      title: "Pastor David Mabote's message of encouragement.",
      preacher: 'Pastor Mabote',
      date: '24 Mar 2014'
    }
  ];

  upcomingSermons = [
    {
      img: '/assets/images/mamoruti.jpg',
      title: 'The Power of Faith',
      description: 'Join us as we explore how faith can move mountains and transform lives.'
    },
    {
      img: '/assets/images/moruti.jpg',
      title: 'Walking in Grace',
      description: 'Discover the beauty of living a life filled with grace and compassion.'
    },
    {
      img: '/assets/images/moruti2.jpg',
      title: 'Hope for Tomorrow',
      description: 'A message of hope and encouragement for the days ahead.'
    }
    // ...add more as needed...
  ];

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;
  private carouselInterval: any;

  showAddSermonTypeDialog = false;
  showAddSermonForm = false;
  addSermonType: 'upcoming' | 'previous' | null = null;

  newSermon = {
    img: '',
    title: '',
    description: ''
  };

  newPrevSermon = {
    videoUrl: '',
    title: '',
    preacher: '',
    date: ''
  };

  isCarouselPaused = false;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Comment out or remove the auto-slide to prevent dynamic scroll that reloads iframes
    // this.addCarouselListeners();
    // this.startCarouselAutoSlide();
  }

  addCarouselListeners() {
    const container = this.carouselContainer?.nativeElement;
    if (!container) return;
    container.addEventListener('mouseenter', this.pauseCarousel);
    container.addEventListener('mouseleave', this.resumeCarousel);
    container.addEventListener('touchstart', this.pauseCarousel, { passive: true });
    container.addEventListener('touchend', this.resumeCarousel, { passive: true });
  }

  pauseCarousel = () => {
    this.isCarouselPaused = true;
  };

  resumeCarousel = () => {
    this.isCarouselPaused = false;
  };

  startCarouselAutoSlide() {
    const scrollStep = 320 + 16; // card width + gap
    this.carouselInterval = setInterval(() => {
      if (this.isCarouselPaused) return;
      const container = this.carouselContainer?.nativeElement;
      if (!container) return;
      // If at end, scroll back to start
      if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 5) {
        container.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        container.scrollBy({ left: scrollStep, behavior: 'auto' });
      }
    }, 3500);
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    const container = this.carouselContainer?.nativeElement;
    if (container) {
      container.removeEventListener('mouseenter', this.pauseCarousel);
      container.removeEventListener('mouseleave', this.resumeCarousel);
      container.removeEventListener('touchstart', this.pauseCarousel);
      container.removeEventListener('touchend', this.resumeCarousel);
    }
  }

  openAddSermonTypeDialog() {
    this.showAddSermonTypeDialog = true;
  }

  closeAddSermonTypeDialog() {
    this.showAddSermonTypeDialog = false;
  }

  selectSermonType(type: 'upcoming' | 'previous') {
    this.addSermonType = type;
    this.showAddSermonTypeDialog = false;
    this.showAddSermonForm = true;
  }

  closeAddSermonForm() {
    this.showAddSermonForm = false;
    this.addSermonType = null;
  }

  addSermon() {
    if (this.newSermon.img && this.newSermon.title && this.newSermon.description) {
      this.upcomingSermons.push({ ...this.newSermon });
      this.showAddSermonForm = false;
      this.addSermonType = null;
      setTimeout(() => this.scrollToLastSermon(), 100);
    }
  }

  addPreviousSermon() {
    if (
      this.newPrevSermon.videoUrl &&
      this.newPrevSermon.title &&
      this.newPrevSermon.preacher &&
      this.newPrevSermon.date
    ) {
      // Ensure the videoUrl is in the correct embed format
      let url = this.newPrevSermon.videoUrl.trim();
      if (!url.includes('embed')) {
        // Convert standard YouTube URL to embed URL
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
        if (match && match[1]) {
          url = `https://www.youtube.com/embed/${match[1]}`;
        }
      }
      this.sermons.push({
        ...this.newPrevSermon,
        videoUrl: url
      });
      this.showAddSermonForm = false;
      this.addSermonType = null;
    }
  }

  scrollToLastSermon() {
    const container = this.carouselContainer?.nativeElement;
    if (container) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    }
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
