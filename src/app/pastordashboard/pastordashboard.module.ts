import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PastordashboardPageRoutingModule } from './pastordashboard-routing.module';

import { PastordashboardPage } from './pastordashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PastordashboardPageRoutingModule
  ],
  declarations: [PastordashboardPage]
})
export class PastordashboardPageModule {}
