import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RouterModule, Routes } from '@angular/router';
import { ZxingComponent } from './zxing.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ZxingDetailModalComponent } from './zxing-detail-modal/zxing-detail-modal.component';

export const routes: Routes = [
  {
    path: '',
    component: ZxingComponent,
  },
];

@NgModule({
  declarations: [ZxingComponent, ZxingDetailModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ZXingScannerModule,
  ],
})
export class ZxingModule {}
