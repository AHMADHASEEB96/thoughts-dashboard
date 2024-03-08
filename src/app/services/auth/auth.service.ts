import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { SignInCredentials } from '../../interfaces/signin.interface';
import { BehaviorSubject } from 'rxjs';
import { LoginResponse } from '../../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  constructor(private authService: AngularFireAuth, private toastr: ToastrService) { }

  signIn(signIndData: SignInCredentials) {
    return this.authService.signInWithEmailAndPassword(signIndData.email, signIndData.password).then(res => {
      console.log(res.user?.getIdToken(), "login res from the service ")
      this.isUserLoggedIn.next(true)
      return res // you should return the res from the first then for the second one to see
    })
  }
  signUp(signIndData: SignInCredentials) {
    return this.authService.createUserWithEmailAndPassword(signIndData.email, signIndData.password).then(res => {
      this.isUserLoggedIn.next(true)
    })
  }
  getUserInfo() {
    return this.authService.authState
  }

  logOut() {
    this.authService.signOut().then(res => {
      this.isUserLoggedIn.next(false)
    })
  }
}
