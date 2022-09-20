import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuth: boolean = false;
  authSubscription: Subscription;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isAuth = this.authService.getAuthStatus();
    this.authSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        this.isAuth = isAuth;
      });
  }



  ngOnDestroy() {
    if(typeof this.authSubscription !=='undefined'){
      this.authSubscription.unsubscribe();
    }
  }
}
