import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userData: any
  isUserLoggedIn: boolean = false

  constructor(private authService: AuthService) { }
  ngOnInit() {
    this.authService.getUserInfo().subscribe({
      next: (userInfo => {
        if (userInfo) {
          this.userData = userInfo
          this.isUserLoggedIn = true
        }
      }),
      error: (er => {
        this.isUserLoggedIn = false;
      })
    })
  }
}
