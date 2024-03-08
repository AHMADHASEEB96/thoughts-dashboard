import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import * as jwt from 'jsonwebtoken';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userData: any
  isUserLoggedIn: boolean = true;
  isLoginPageActive: boolean = false;
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }



  ngOnInit() {
    console.log('this is the decoded token',)
    this.activatedRoute.url.subscribe({
      next: (res => {
        console.log(res)
      })
    })
    this.authService.getUserInfo().subscribe({
      next: (userInfo => {
        if (userInfo) {
          this.userData = userInfo
        }
      })
    })

    //
    this.authService.isUserLoggedIn.subscribe({
      next: (res => {
        this.isUserLoggedIn = res
      })
    })
  }
}

// test pass test@mail.com test11
