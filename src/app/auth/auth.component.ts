import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { SignInCredentials } from '../interfaces/signin.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  formStatus: string = "login"
  authForm: NgForm;
  isAuthLoading: boolean = false;
  isWrongCredentials: boolean = false;
  isSignUpFailed: boolean = false;
  signUpErrorMessage: string = "Sign up failed, Please try again"
  isPassVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  togglePassVisibility(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains('fa-eye')) {
      target.classList.remove('fa-eye')
      target.classList.add('fa-eye-slash')
    } else {
      target.classList.add('fa-eye')
      target.classList.remove('fa-eye-slash')
    }
    this.isPassVisible = !this.isPassVisible
  } get authFormControls() {
    return this.authForm.controls
  }
  submitAuthForm(e: Event, authFormObj: NgForm) { // a form object of type NgForm and not an HTMLFormElement
    this.isAuthLoading = true
    this.authForm = authFormObj
    console.log(authFormObj, this.authFormControls)

    if (this.formStatus == "login") {
      this.authService.signIn(authFormObj.value).then(res => {
        this.isAuthLoading = false
        this.isWrongCredentials = false
        this.router.navigate([''])

      }).catch(error => {
        this.isAuthLoading = false;
        this.isWrongCredentials = true

      })

    } else {
      this.authService.signUp(authFormObj.value).then(res => {
        this.isAuthLoading = false;
        this.isSignUpFailed = false
        this.router.navigate([''])
      }).catch(error => {
        this.signUpErrorMessage = error.message
        this.isAuthLoading = false;
        this.isSignUpFailed = true;
      })
    }
  }
}
