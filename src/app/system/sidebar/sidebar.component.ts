import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  user;
  isAuth: boolean;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isAuth = this.authService.getAuthStatus();
    if (this.isAuth) {
      this.user = this.authService.getUserDoc();
    }
  }

  logout() {
    this.authService.logOut();
  }

  editUser(id) {
    this.router.navigate(['/system/user/' + id]);
  }
}
