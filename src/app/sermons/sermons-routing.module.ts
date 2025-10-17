import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SermonsPage } from './sermons.page';

const routes: Routes = [
  {
    path: '',
    component: SermonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SermonsPageRoutingModule {}
