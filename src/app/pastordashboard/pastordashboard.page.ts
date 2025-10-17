import { Component } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pastordashboard',
  templateUrl: './pastordashboard.page.html',
  styleUrls: ['./pastordashboard.page.scss'],
  standalone: false
})
export class PastordashboardPage {
  stats = [
    {
      title: 'Total Members',
      value: '284',
      change: '+12 this month',
      icon: 'people',
      color: 'blue',
    },
    {
      title: 'Active Members',
      value: '267',
      change: '94% active rate',
      icon: 'checkmark-done-circle',
      color: 'green',
    },
    {
      title: 'Recent Sermons',
      value: '8',
      change: 'This month',
      icon: 'chatbubbles',
      color: 'purple',
    },
    {
      title: 'Upcoming Events',
      value: '3',
      change: 'Next 7 days',
      icon: 'calendar',
      color: 'orange',
    },
  ];

  recentActivity = [
    { action: 'New member registered', name: 'Sarah Johnson', time: '2 hours ago', liked: false },
    { action: 'Sermon uploaded', name: 'The Power of Faith', time: '5 hours ago', liked: false },
    { action: 'Event created', name: 'Youth Bible Study', time: '1 day ago', liked: false },
    { action: 'Post published', name: 'Weekly Announcements', time: '2 days ago', liked: false },
  ];

  quickActions = [
    {
      title: 'Manage Members',
      icon: 'people',
      color: 'blue',
      href: '/members',
    },
    {
      title: 'Add Sermon',
      icon: 'chatbubbles',
      color: 'purple',
      href: '/sermons',
    },
    {
      title: 'Create Event',
      icon: 'calendar',
      color: 'orange',
      href: '/events',
    },
    {
      title: 'Write Post',
      icon: 'create',
      color: 'green',
      href: '/posts',
    },
  ];

  showQuickActionModal = false;

  constructor(private toastController: ToastController, private modalController: ModalController) {}

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'primary',
      animated: true
    });
    toast.present();
  }

  onStatDetails(stat: any) {
    this.showToast(`${stat.title}: ${stat.value} (${stat.change})`);
  }

  onLikeActivity(activity: any) {
    activity.liked = !activity.liked;
    this.showToast(activity.liked ? 'You liked this activity!' : 'You unliked this activity.');
  }

  openQuickActionModal() {
    this.showQuickActionModal = true;
  }

  closeQuickActionModal() {
    this.showQuickActionModal = false;
  }

  onQuickAction(action: any) {
    this.showToast(`Quick action: ${action.title}`);
    this.closeQuickActionModal();
  }
}
