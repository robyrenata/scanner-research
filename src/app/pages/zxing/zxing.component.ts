import { Component, OnInit, ViewChild } from '@angular/core';
import { PermissionService } from 'src/app/shared/service/permission.service';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { firstValueFrom } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ZxingDetailModalComponent } from './zxing-detail-modal/zxing-detail-modal.component';

@Component({
  selector: 'app-zxing',
  templateUrl: './zxing.component.html',
  styleUrls: ['./zxing.component.scss'],
})
export class ZxingComponent implements OnInit {
  @ViewChild('zxing') scanner: ZXingScannerComponent | unknown;

  allowedFormats = [BarcodeFormat.QR_CODE];

  isGranted: boolean | unknown;
  constructor(
    private permissionSrv: PermissionService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.permissionSrv
      .permissionResolver()
      .then((value) => {
        this.isGranted = value;
        this.scanningStart();
      })
      .catch((error) => {
        this.isGranted = false;
        console.log(error);
      });
  }

  async scanningStart() {
    const scannerComp = this.scanner as ZXingScannerComponent;
    await firstValueFrom(scannerComp.scanSuccess).then((value) => {
      console.log(value);
      scannerComp.enable = false;
      this.openDetailModal(value);
    });
  }

  async openDetailModal(value: any) {
    const modal = await this.modalCtrl.create({
      component: ZxingDetailModalComponent,
      componentProps: {
        data: value,
      },
    });

    modal.present().finally(() => {
      modal.onDidDismiss().finally(() => {
        const scannerComp = this.scanner as ZXingScannerComponent;
        scannerComp.enable = true;
        this.scanningStart();
      });
    });
  }
}
