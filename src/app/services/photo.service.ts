import { Injectable } from '@angular/core';
import {Plugins, CameraResultType, Capacitor,
  FilesystemDirectory, CameraPhoto, CameraSource} from '@capacitor/core';
import { Photo } from '../models/photo';

const {Camera, Filesystem, Storage} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor() { }

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    this.photos.unshift({
      filepath: "soon...",
      webviewPath: capturedPhoto.webPath,
    });
  }
}
