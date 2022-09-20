import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from 'src/app/service/posts/posts.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, OnDestroy {
  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {}
  user: any;
  posts: Post[];
  temp;
  displayedColumns = ['title', 'published', 'category','actions'];
  isLoading: boolean = true;
  postSubs: Subscription;
  postDeleteSub: Subscription;
  postPublishSub: Subscription;
  ngOnInit() {
    this.user = this.authService.getUserDoc();
    this.posts = this.user.posts;
    this.isLoading = false;
    this.postSubs = this.postsService.getUserPosts(this.user._id).subscribe(
      (post: any) => {
        this.temp = post;
        this.posts = this.temp;
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

  deletePost(id) {
    this.postDeleteSub = this.postsService.deletePost(id).subscribe(
      (res: any) => {
        this._snackbar.open(res.message, null, {
          duration: 5000,
        });

        this.posts = this.posts.filter((p) => p._id !== id);

        this.isLoading = false;
      },
      (error) => {
        this._snackbar.open(error.error.message, null, {
          duration: 5000,
        });
        this.isLoading = false;
      }
    );
  }

  updatePost(id) {
    this.router.navigate(['/system/post/' + id]);
  }
  searchInPosts(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((x) => {
      return x.title.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.posts = temp;
  }
  publishPost(id, publishState) {
    this.postPublishSub = this.postsService
      .publishPost(id, publishState)
      .subscribe(
        (res: { message }) => {
          this._snackbar.open(res.message, null, {
            duration: 5000,
          });

          const i = this.posts.findIndex((p) => p._id === id);
          this.posts[i].published = !publishState;
          console.log(this.posts);
          this.posts = JSON.parse(JSON.stringify(this.posts));
          // location.reload();
          this.isLoading = false;
        },
        (error) => {
          this._snackbar.open(error.error.message, null, {
            duration: 5000,
          });
          this.isLoading = false;
        }
      );
  }
  ngOnDestroy() {
    if (typeof this.postSubs !== 'undefined') {
      this.postSubs.unsubscribe();
    }
    if (typeof this.postPublishSub !== 'undefined') {
      this.postPublishSub.unsubscribe();
    }
    if (typeof this.postDeleteSub !== 'undefined') {
      this.postDeleteSub.unsubscribe();
    }
  }
}
