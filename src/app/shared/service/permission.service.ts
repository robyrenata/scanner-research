import { Injectable } from '@angular/core';
import { Camera } from '@capacitor/camera';
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor() {}

  permissionResolver() {
    return new Promise(async (resolve, reject) => {
      const permissionState = (await Camera.checkPermissions()).camera;
      switch (permissionState) {
        case 'denied':
          reject(permissionState);
          break;
        case 'granted':
          resolve(permissionState);
          break;
        default:
          Camera.requestPermissions();
          break;
      }
    });
  }
}
