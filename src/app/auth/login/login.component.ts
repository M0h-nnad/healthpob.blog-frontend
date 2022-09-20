import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  userData;
  loginSub: Subscription;
  isLogin;
  constructor(
    private authService: AuthService,
    private _snackbar: MatSnackBar,
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
    return this.loginForm;
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  initReq() {
    this.userData = {
      email: this.formControl.controls.email.value,
      password: this.formControl.controls.password.value,
    };
  }

  Login() {
    this.initReq();
    this.loginSub = this.authService.login(this.userData).subscribe(
      (Response: any) => {
        this._snackbar.open(Response.body.message, null, {
          duration: 5000,
        });
        if (Response.headers.get('token')) {
          this.authService.isAuthlistener.next(true);
          this.authService.isAuth = true;
          const now = new Date();

          const expiresInDuration = Response.headers.get('expiresin');
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.authService.saveAuthData(
            Response.headers.get('token'),
            expirationDate,
            Response.body.userDoc
          );
          this._snackbar.open(Response.body.message, null, {
            duration: 5000,
          });
          return this.route.navigate(['/system/dashboard']);
        }
      },
      (error) => {
        this._snackbar.open(error.error.message, null, {
          duration: 5000,
        });
      }
    );
  }
  ngOnDestroy() {
    if (typeof this.loginSub !== 'undefined') {
      this.loginSub.unsubscribe();
    }
  }
}
