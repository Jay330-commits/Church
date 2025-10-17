import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'service' | 'meeting' | 'study' | 'outreach' | 'youth' | 'worship';
  attendees: number;
  maxAttendees?: number;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: false
})
export class EventsPage implements OnInit, AfterViewInit {
  events: ChurchEvent[] = [
    {
      id: "1",
      title: "Sunday Morning Service",
      description: "Weekly worship service with communion",
      date: "2024-06-02",
      time: "10:00",
      location: "Main Sanctuary",
      type: "service",
      attendees: 245,
      maxAttendees: 300
    },
    {
      id: "3",
      title: "Community Outreach",
      description: "Food distribution and community service",
      date: "2024-06-06",
      time: "14:00",
      location: "Community Center",
      type: "outreach",
      attendees: 18,
      maxAttendees: 25
    }
  ];

  eventForm: FormGroup;
  isModalOpen = false;
  editingEvent: ChurchEvent | null = null;
  showMobileMenu: boolean = false;
  showHeaderTitle: boolean = true;
  @ViewChild('contentScroll') contentScroll!: ElementRef;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      type: ['service', Validators.required],
      maxAttendees: ['']
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // Optionally, you can set initial state here if needed
  }

  onContentScroll(event: any) {
    // For Ionic, event.detail.scrollTop is the scroll position
    const scrollTop = event && event.detail ? event.detail.scrollTop : 0;
    if (window.innerWidth > 600) {
      this.showHeaderTitle = scrollTop < 50;
    } else {
      this.showHeaderTitle = true;
    }
  }

  get totalAttendees() {
    return this.events.reduce((sum, event) => sum + event.attendees, 0);
  }

  get eventsThisWeek() {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= weekFromNow;
    }).length;
  }

  openCreateModal() {
    this.editingEvent = null;
    this.eventForm.reset({ type: 'service' });
    this.isModalOpen = true;
  }

  openEditModal(event: ChurchEvent) {
    this.editingEvent = event;
    this.eventForm.patchValue({ ...event });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingEvent = null;
    this.eventForm.reset({ type: 'service' });
  }

  saveEvent() {
    if (this.eventForm.invalid) return;
    const formValue = this.eventForm.value;
    if (this.editingEvent) {
      // Edit
      this.events = this.events.map(ev =>
        ev.id === this.editingEvent!.id
          ? { ...ev, ...formValue }
          : ev
      );
    } else {
      // Create
      const newEvent: ChurchEvent = {
        ...formValue,
        id: Date.now().toString(),
        attendees: 0
      };
      this.events = [...this.events, newEvent];
    }
    this.closeModal();
  }

  async deleteEvent(eventId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Event',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.events = this.events.filter(ev => ev.id !== eventId);
          }
        }
      ]
    });
    await alert.present();
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getEventTypeColor(type: ChurchEvent['type']) {
    const map: any = {
      service: 'primary',
      meeting: 'success',
      study: 'tertiary',
      outreach: 'warning',
      youth: 'danger',
      worship: 'medium'
    };
    return map[type] || 'medium';
  }

  scrollToFooter(event: Event) {
    event.preventDefault();
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
