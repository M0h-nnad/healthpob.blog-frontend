import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  userData: User;
  signupSub: Subscription;
  isLogin;
  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private route: Router
  ) {}

  ngOnInit() {
    this.isLogin = this.authService.getAuthStatus();
    if (this.isLogin) {
      this.route.navigate(['/system/dashboard']);
    }
    this.initForm();
  }

  get formControl() {
    return this.signupForm;
  }

  initForm() {
    this.signupForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      specialty: new FormControl('', Validators.required),
      yearsOfExperience: new FormControl('', [Validators.required]),
    });
  }

  initReq() {
    this.userData = {
      firstName: this.signupForm.controls.firstName.value,
      lastName: this.signupForm.controls.lastName.value,
      email: this.signupForm.controls.email.value,
      password: this.signupForm.controls.password.value,
      specialty: this.signupForm.controls.specialty.value,
      yearsOfExperience: this.signupForm.controls.yearsOfExperience.value,
    };
  }

  signUp() {
    this.initReq();
    this.authService.signUp(this.userData).subscribe(
      (Response: any) => {
        console.log(Response.headers.get('token'));
        if (Response.headers.get('token')) {
          this.authService.isAuthlistener.next(true);
          this.authService.isAuth = true;
          const expiresInDuration = Response.headers.get('expiresIn');
          this.authService.setAuthTime(expiresInDuration);
          const now = new Date();
          const expiresInDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.authService.saveAuthData(
            Response.headers.get('token'),
            expiresInDate,
            Response.body.newUser
          );
          return this.route.navigate(['/system/posts']);
        }
      },
      (error) => {
        this._snackBar.open(error.error.message, null, {
          duration: 5000,
        });
      }
    );
  }

  ngOnDestroy() {
    if (typeof this.signupSub !== 'undefined') {
      this.signupSub.unsubscribe();
    }
  }
}
