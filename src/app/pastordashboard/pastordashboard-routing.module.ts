import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PastordashboardPage } from './pastordashboard.page';

const routes: Routes = [
  {
    path: '',
    component: PastordashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PastordashboardPageRoutingModule {}
