import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SermonsPageRoutingModule } from './sermons-routing.module';

import { SermonsPage } from './sermons.page';
import { SafePipe } from '../tabs/safe.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SermonsPageRoutingModule,
    SafePipe
  ],
  declarations: [SermonsPage]
})
export class SermonsPageModule {}
