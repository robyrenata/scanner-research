import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-zxing-detail-modal',
  templateUrl: './zxing-detail-modal.component.html',
  styleUrls: ['./zxing-detail-modal.component.scss'],
})
export class ZxingDetailModalComponent {
  @Input() data: any;
  constructor(private modalCtrl: ModalController) {}

  async dimissModal() {
    await this.modalCtrl.dismiss();
  }
}
