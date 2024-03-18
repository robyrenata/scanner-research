import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapmlComponent } from './capml.component';
import { IonicModule } from '@ionic/angular';

import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: CapmlComponent,
  },
];

@NgModule({
  declarations: [CapmlComponent],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class CapmlModule {}
