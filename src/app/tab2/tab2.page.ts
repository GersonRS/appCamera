import { async } from '@angular/core/testing';
import { PhotoService } from './../services/photo.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Photo } from '../models/photo';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController
    ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public async showActionSheet(photo: Photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.delePicture(photo, position);
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }
}
