import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { PermissionService } from 'src/app/shared/service/permission.service';
import {
  BarcodeScanner,
  LensFacing,
  StartScanOptions,
} from '@capacitor-mlkit/barcode-scanning';
import { InputCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-capml',
  templateUrl: './capml.component.html',
  styleUrls: ['./capml.component.scss'],
})
export class CapmlComponent implements AfterViewInit {
  @ViewChild('square')
  public squareElement: ElementRef<HTMLDivElement> | undefined;
  isGranted: boolean | unknown;
  public minZoomRatio: number | undefined;
  public maxZoomRatio: number | undefined;
  public lensFacing: LensFacing = LensFacing.Back;

  constructor(
    private permissionSrv: PermissionService,
    private readonly ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.permissionSrv
      .permissionResolver()
      .then((value) => {
        this.isGranted = value;
        setTimeout(() => {
          this.scanningStart();
        }, 500);
      })
      .catch((error) => {
        this.isGranted = false;
        console.log(error);
      });
  }

  async scanningStart() {
    // Hide everything behind the modal (see `src/theme/variables.scss`)
    document.querySelector('body')?.classList.add('barcode-scanning-active');

    const options: StartScanOptions = {
      lensFacing: this.lensFacing,
    };

    const squareElementBoundingClientRect =
      this.squareElement?.nativeElement.getBoundingClientRect();
    const scaledRect = squareElementBoundingClientRect
      ? {
          left: squareElementBoundingClientRect.left * window.devicePixelRatio,
          right:
            squareElementBoundingClientRect.right * window.devicePixelRatio,
          top: squareElementBoundingClientRect.top * window.devicePixelRatio,
          bottom:
            squareElementBoundingClientRect.bottom * window.devicePixelRatio,
          width:
            squareElementBoundingClientRect.width * window.devicePixelRatio,
          height:
            squareElementBoundingClientRect.height * window.devicePixelRatio,
        }
      : undefined;
    const detectionCornerPoints = scaledRect
      ? [
          [scaledRect.left, scaledRect.top],
          [scaledRect.left + scaledRect.width, scaledRect.top],
          [
            scaledRect.left + scaledRect.width,
            scaledRect.top + scaledRect.height,
          ],
          [scaledRect.left, scaledRect.top + scaledRect.height],
        ]
      : undefined;
    const listener = await BarcodeScanner.addListener(
      'barcodeScanned',
      async (event) => {
        this.ngZone.run(() => {
          const cornerPoints = event.barcode.cornerPoints;
          if (detectionCornerPoints && cornerPoints) {
            if (
              detectionCornerPoints[0][0] > cornerPoints[0][0] ||
              detectionCornerPoints[0][1] > cornerPoints[0][1] ||
              detectionCornerPoints[1][0] < cornerPoints[1][0] ||
              detectionCornerPoints[1][1] > cornerPoints[1][1] ||
              detectionCornerPoints[2][0] < cornerPoints[2][0] ||
              detectionCornerPoints[2][1] < cornerPoints[2][1] ||
              detectionCornerPoints[3][0] > cornerPoints[3][0] ||
              detectionCornerPoints[3][1] < cornerPoints[3][1]
            ) {
              return;
            }
          }
          listener.remove();
        });
      }
    );
    await BarcodeScanner.startScan(options);
    void BarcodeScanner.getMinZoomRatio().then((result) => {
      this.minZoomRatio = result.zoomRatio;
    });
    void BarcodeScanner.getMaxZoomRatio().then((result) => {
      this.maxZoomRatio = result.zoomRatio;
    });
  }

  setZoomRatio(event: InputCustomEvent): void {
    if (!event.detail.value) {
      return;
    }
    BarcodeScanner.setZoomRatio({
      zoomRatio: parseInt(event.detail.value as any, 10),
    });
  }
}
