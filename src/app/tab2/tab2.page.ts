import { PhotoService } from './../services/photo.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  photos = this.photoService.photos;

  constructor(public photoService: PhotoService) {}

  addPhotoToGallery(){
    this.photoService.addNewToGallery();
  }
}
