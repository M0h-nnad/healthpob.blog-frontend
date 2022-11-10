import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-blog-users',
  templateUrl: './blog-users.component.html',
  styleUrls: ['./blog-users.component.scss'],
})
export class BlogUsersComponent implements OnInit, OnDestroy {
  users: User;
  temp;
  usersSubscription: Subscription;
  isLoading:boolean = true;
  constructor(
    private AuthService: AuthService,
    private _snackbar: MatSnackBar,
    private router:Router
  ) {}

  ngOnInit() {

    this.usersSubscription = this.AuthService.getUsers().subscribe(
      (res: User) => {
        this.temp = res;
        this.users = this.temp
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this._snackbar.open(error.error.message, null, {
          duration: 5000,
        });
      }
    );
  }

  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((x) => {
      return x.firstName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.users = temp;
  }

  openUser(id){
    this.router.navigate(['/blog/doctors/'+id])
  }

  ngOnDestroy() {
    if (typeof this.usersSubscription !== 'undefined') {
      this.usersSubscription.unsubscribe();
    }
  }
}
