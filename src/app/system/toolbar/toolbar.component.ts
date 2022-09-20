import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  isAuth;
  user;
  @Input('isMobile') isMobile;
  @Output('toggle') toggle = new EventEmitter<boolean>(false);
  opened = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuth = this.authService.getAuthStatus();
    if (this.isAuth) {
      this.user = this.authService.getUserDoc();
    }
  }

  openSideBar() {
    this.opened = !this.opened;
    this.toggle.emit(this.opened);
  }

  logout() {
    this.authService.logOut();
  }
}
