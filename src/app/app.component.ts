import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from './service/auth/auth.service';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'healtpod-blog';
  isloading: boolean = true;
  subscription;
  isReloaded;
  constructor(private authService: AuthService, private router: Router) {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isReloaded = !this.router.navigated;
      }
    });
  }

  ngOnInit() {
    this.isloading = this.authService.autoAuthUser();
  }
}
