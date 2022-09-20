import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError, Subject, observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthlistener: Subject<boolean> = new Subject();
  isAuth: boolean = false;
  private tokenTimer;

  SERVER_URL = '/api/users';

  constructor(
    private http: HttpClient,
    private route: Router,
    private cookieService: CookieService,
    private _snackbar: MatSnackBar
  ) {}

  getUserDoc(){
    return JSON.parse(this.cookieService.get('userDoc'))
  }
  getToken(){
    return this.cookieService.get('token');
  }


  getAuthStatus() {
    return this.isAuth;
  }
  getAuthStatusListener() {
    return this.isAuthlistener.asObservable();
  }

  getUsers(){
    return this.http.get(`${this.SERVER_URL}/`).pipe(catchError(err=>{
      return throwError(err);
    }))
  }

  getUser(id){
    return this.http.get(`${this.SERVER_URL}/${id}`).pipe(catchError(err=>{
      return throwError(err);
    }))
  }

  signUp(userData) {
    return this.http
      .post(`${this.SERVER_URL}/signup`, userData,{observe: 'response'})
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      )

  }

  login(userData) {
    return this.http
      .post(`${this.SERVER_URL}/login`, userData,{observe: 'response'})
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      )

  }

  updateUser(id, UserReq) {
    return this.http
      .put(this.SERVER_URL + '/' + 'update' + '/' + id, UserReq)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIN = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIN > 0) {
      this.isAuth = true;
      this.setAuthTime(expiresIN / 1000);
      this.isAuthlistener.next(true);
    }
    return false;
  }

  logOut() {
    this.isAuth = false;
    this.clearAuthData();
    this.isAuthlistener.next(false);
    clearTimeout(this.tokenTimer);
    this.route.navigate(['/system/login']);
  }

  updatePassword(passObject){
    return this.http.put(`${this.SERVER_URL}/changepassword`,passObject).pipe(catchError(err=>{
      return throwError(err);
    }))
  }

  setAuthTime(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  saveAuthData(token: string, expirationDate: Date, UserDoc:any) {
    this.cookieService.set('token', token);
    this.cookieService.set('expirationDate', expirationDate.toISOString());
    this.cookieService.set('userDoc', JSON.stringify(UserDoc));
  }

  private clearAuthData() {
    this.cookieService.deleteAll();
  }

  private getAuthData() {
    const token = this.cookieService.get('token');
    const expirationDate = this.cookieService.get('expirationDate');
    const checkUserDoc = this.cookieService.check('userDoc');
    const userDocJson = this.cookieService.get('userDoc');

    if (!token && !expirationDate && !checkUserDoc) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userDoc: JSON.parse(userDocJson),
    };
  }
}
