import { LoginResponse, User, StsTokenManager } from './../interfaces/login-response.interface';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { SignInCredentials } from '../interfaces/signin.interface';
import { Router } from '@angular/router';

type authFormValues = {
  email: string,
  password: string,
  confirmPassword?: string,
}
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
  signUpErrorMessages: string[] = ["Sign up failed, Please try again"]
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

  }

  // validate passwords
  seeIfPasswordsValid(_authFormValues: authFormValues) {
    return _authFormValues.password == _authFormValues.confirmPassword && this.formStatus == 'signup' && _authFormValues.password?.length > 5
  }

  // validate mail
  seeIfMailValid(_authFormValues: authFormValues) {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(_authFormValues.email) && _authFormValues.email != '';
  }

  get authFormControls() {
    return this.authForm.controls
  }

  isFormValid(authFormObj: NgForm) {
    const authFormValues: authFormValues = authFormObj.value
    const isConfirmPassMatchingPass = this.seeIfPasswordsValid(authFormValues);
    const isMailValid: boolean = this.seeIfMailValid(authFormValues)

    return isConfirmPassMatchingPass && isMailValid
  }

  submitAuthForm(e: Event, authFormObj: NgForm) { // a form object of type NgForm and not an HTMLFormElement
    this.isAuthLoading = true
    this.authForm = authFormObj
    console.log(authFormObj, this.authFormControls)
    const authFormValues: authFormValues = authFormObj.value
    const isConfirmPassMatchingPass = this.seeIfPasswordsValid(authFormValues)
    console.log(isConfirmPassMatchingPass)

    if (this.formStatus == "login") {
      this.authService.signIn(authFormValues).then(res => {
        res.user?.getIdToken().then(token => {
          // getIdToken() returns a promise  
          window.localStorage.setItem('token', token)
        })
        console.log(res.user?.getIdToken(), "login response ")
        this.isAuthLoading = false
        this.isWrongCredentials = false
        this.router.navigate([''])

      }).catch(error => {
        this.isAuthLoading = false;
        this.isWrongCredentials = true

      })

    } else { // Signup
      if (isConfirmPassMatchingPass) {
        this.authService.signUp(authFormValues).then(res => {
          this.isAuthLoading = false;
          this.isSignUpFailed = false
          this.router.navigate([''])
        }).catch(error => {
          this.signUpErrorMessages.push(error.message)
          this.isAuthLoading = false;
          this.isSignUpFailed = true;
        })
      } else {
        this.isSignUpFailed = true;
        this.signUpErrorMessages.push(" Confirmation password does'nt match password")
      }

    }
  }
}

/* First layer of validation is to disable the button as long the form is invalid, the second is to prevent sending the request if for any reason the button is now enabled
while the form is still invalid 
-- For sure all this validation could be easily done using reactive forms and custom validators, but I started the from validation with template driving forms approach which 
does not have these custom mail and passwords validations so I had to create a custom validations for them 
*/