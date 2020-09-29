import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  user$: Observable<firebase.User>;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.authService.getUser();
  }

  logout(){
    this.authService.SignOut()
      .then(() => {
        this.router.navigateByUrl('login');
      });
  }
}
