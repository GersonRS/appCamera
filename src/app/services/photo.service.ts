import { AuthService } from './auth.service';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import {
  Plugins, CameraResultType, Capacitor,
  FilesystemDirectory, CameraPhoto, CameraSource
} from '@capacitor/core';
import { Photo } from '../models/photo';
import { take } from 'rxjs/operators';

import { AngularFireStorage } from '@angular/fire/storage';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];
  private PHOTO_STORAGE = 'photos';
  private platform: Platform;

  constructor(
    platform: Platform,
    public authService: AuthService,
    public fireStorage: AngularFireStorage
    ) {
    this.platform = platform;
  }

  public async loadSaved() {
    const photoList = await Storage.get({
      key: this.PHOTO_STORAGE
    });
    this.photos = JSON.parse(photoList.value) || [];

    if (!this.platform.is('hybrid')) {
      for (const photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: FilesystemDirectory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  private async savePicture(cameraPhoto: CameraPhoto) {
    const fileName = new Date().getTime() + '.jpeg';
    const base64Data = await this.readAsBase64(cameraPhoto, fileName);

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri)
      };
    }
    else {
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath,
      };
    }
  }
  private async readAsBase64(cameraPhoto: CameraPhoto, filename: string) {
    // Fetch the photo, read as a blob, then convert to base64 format
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });
      this.uploadPicture(file.data, filename);
      return file.data;
    }
    else {
      const response = await fetch(cameraPhoto.webPath);
      const blob = await response.blob();
      this.uploadPicture(blob, filename);
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  public async delePicture(photo: Photo, position: number) {
    this.photos.splice(position, 1);
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data
    });
    this.authService.getUser().
    pipe(
      take(1)
    ).subscribe((user) => {
      const ref = this.fireStorage.ref(user.uid + '/' + filename);
      ref.delete();
    });

  }

  private uploadPicture(file: any, filename: string){
    this.authService.getUser().
    pipe(
      take(1)
    ).subscribe((user) => {
      const ref = this.fireStorage.ref(user.uid + '/' + filename);
      const task = ref.put(file);
    });
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  })
}
