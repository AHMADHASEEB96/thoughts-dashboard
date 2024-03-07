import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { SignInCredentials } from '../../interfaces/signin.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authService: AngularFireAuth, private toastr: ToastrService) { }

  signIn(signIndData: SignInCredentials) {
    return this.authService.signInWithEmailAndPassword(signIndData.email, signIndData.password)
  }
  signUp(signIndData: SignInCredentials) {
    return this.authService.createUserWithEmailAndPassword(signIndData.email, signIndData.password)
  }
  getUserInfo() {
    return this.authService.authState
  }
}
