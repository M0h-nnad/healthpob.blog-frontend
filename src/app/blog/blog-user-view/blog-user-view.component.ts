import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-blog-user-view',
  templateUrl: './blog-user-view.component.html',
  styleUrls: ['./blog-user-view.component.scss'],
})
export class BlogUserViewComponent implements OnInit, OnDestroy {
  user: User;
  userId: string;
  isLoading: boolean = true;
  userSubscription: Subscription;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (typeof this.userId === undefined) return (this.isLoading = false);
    this.userSubscription = this.authService.getUser(this.userId).subscribe(
      (res: any) => {
        this.user = res[0];
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this._snackBar.open(err.error.message, null, { duration: 5000 });
      }
    );
  }

  ngOnDestroy() {
    if (typeof this.userSubscription !=='undefined') {
      this.userSubscription.unsubscribe();
    }
  }
}
