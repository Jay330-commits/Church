import { Component, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { LoadingController } from '@ionic/angular';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { AlertController,ModalController  } from '@ionic/angular';



@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  showMobileMenu = false;
  showHeaderTitle = true;
  showLoginForm = false;
  showSignupForm = false;
  loginForm: FormGroup;
  signupForm: FormGroup;
  @ViewChild('contentScroll', { static: false }) contentScroll!: ElementRef;

  sermons = [
    {
      videoUrl: 'https://www.youtube.com/embed/eKMOq2js2D0',
      title: "Pastor Mabote | Father's day",
      preacher: 'Pastor Mabote',
      date: '24 Mar 2014'
    },
    {
      videoUrl: 'https://www.youtube.com/embed/OCyfEpKvdW8',
      title: 'Ev. Keitumetse Mabote  - Ho tsamaea moeeng',
      preacher: 'Keitumetse Mabote',
      date: '24 Mar 2014'
    },
    {
      videoUrl: 'https://www.youtube.com/embed/eKMOq2js2D0',
      title: "Pastor Mabote | Father's day",
      preacher: 'Pastor Mabote',
      date: '24 Mar 2014'
    },
    {
      videoUrl: 'https://www.youtube.com/embed/7MCN0MZxl3c',
      title: "Pastor David Mabote's message of encouragement.",
      preacher: 'Pastor Mabote',
      date: '24 Mar 2014'
    }
  ];


  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private db: Database, // Inject Realtime Database
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]{7,15}$/)]],
      dateJoined: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }



  onContentScroll(event: Event) {
    const target = event.target as HTMLElement;
    // Only hide header on scroll for screens wider than 600px
    if (window.innerWidth > 600) {
      this.showHeaderTitle = target.scrollTop < 50;
    } else {
      this.showHeaderTitle = true;
    }
  }

  scrollToFooter(event: Event) {
    event.preventDefault();
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  }

async onLoginSubmit() {
  if (this.loginForm.invalid) {
    // Optionally show some validation errors
    return;
  }

  const { email, password } = this.loginForm.value;

  // Show loading spinner
  const loading = await this.loadingCtrl.create({
    message: 'Logging in...',
    spinner: 'crescent',
    translucent: true,
    cssClass: 'custom-loader'
  });
  await loading.present();

  try {
    // Real Firebase sign-in
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

    // Login successful, you can do more with userCredential if needed
    console.log('Logged in:', userCredential.user);

    this.loginForm.reset();
    // Possibly navigate or show logged-in UI here

  } catch (error: any) {
    console.error('Login error:', error);
    alert(error.message || 'Login failed');
  } finally {
    await loading.dismiss();
  }
}

  passwordsMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      // Clear mismatch error if previously set
      if (form.get('confirmPassword')?.hasError('mismatch')) {
        form.get('confirmPassword')?.setErrors(null);
      }
      return null;
    }
  }

  async onSignupSubmit() {
    if (this.signupForm.invalid) return;
    const { email, password, name, surname, phone, dateJoined } = this.signupForm.value;
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      // Store additional user details in Realtime Database
      await set(ref(this.db, `users/${uid}`), {
        name,
        surname,
        email,
        phone,
        dateJoined
      });
      this.showSignupForm = false;
      this.signupForm.reset();
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error?.code === 'PERMISSION_DENIED' || error?.message?.toLowerCase().includes('permission')) {
        alert('Permission denied: Please check your Firebase Realtime Database rules.');
      } else {
        alert(error.message || 'Signup failed');
      }
    }
  }


  async showPopup(message: string) {
  const modal = await this.modalCtrl.create({
    component: MessagePopupComponent,
    componentProps: { message },
    cssClass: 'popup-modal'
  });
  await modal.present();

  setTimeout(() => modal.dismiss(), 2000); // auto close after 2s
}

}

