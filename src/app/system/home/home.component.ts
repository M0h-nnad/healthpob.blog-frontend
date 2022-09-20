import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  HostListener,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WINDOW } from '../../service/window.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  isAuth: boolean;
  authSubscription: Subscription;
  isMobile;
  isOpened = true;
  innerWidth;
  resizeTimeout;
  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this.innerWidth = this.window.innerWidth;
    this.isAuth = this.authService.getAuthStatus();
    this.authSubscription = this.authService.getAuthStatusListener().subscribe(
      (isAuth) => {
        this.isAuth = isAuth;
      },
      (error) => {
        this._snackBar.open(error.error.message, null, {
          duration: 5000,
        });
      }
    );
  }

  ngAfterViewInit(): void {
    setTimeout(
      () => {
        this.updateLayout();
      },

      0
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  updateLayout() {
    if (this.innerWidth < 1200) {
      this.isMobile = true;
      this.isOpened = false;
    } else {
      this.isMobile = false;
      this.isOpened = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(
      (() => {
        this.innerWidth = event.target.innerWidth;
        this.updateLayout();
        // this.setMenuLayout();
        // this.hideCompactMenuOnSmallScreen();
      }).bind(this),
      500
    );
  }

  toggleSide(val) {
    this.isOpened = val;
  }

  ngOnDestroy() {
    if (typeof this.authSubscription !== 'undefined') {
      this.authSubscription.unsubscribe();
    }
  }
}
