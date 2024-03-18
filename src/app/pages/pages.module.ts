import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'zxing',
    loadChildren: () =>
      import('./zxing/zxing.module').then((m) => m.ZxingModule),
  },
  {
    path: 'capml',
    loadChildren: () =>
      import('./capml/capml.module').then((m) => m.CapmlModule),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PagesModule {}
