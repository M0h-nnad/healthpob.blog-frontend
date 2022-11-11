import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from 'src/app/service/posts/posts.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';

import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-blog-post-view',
  templateUrl: './blog-post-view.component.html',
  styleUrls: ['./blog-post-view.component.scss'],
})
export class BlogPostViewComponent implements OnInit, OnDestroy {
  postId: string;
  isLoading: boolean = true;
  post: Post;
  postSub: Subscription;
  author: User;
  isReloaded;
  subscription: Subscription;
  increseSub$: Subscription;
  constructor(
    private postService: PostsService,
    private route: ActivatedRoute,
    private Router: Router,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (typeof this.postId === undefined) {
      return this.Router.navigate['/blog/posts'];
    }
    this.isReloaded = browserRefresh;
    this.postSub = this.postService
      .getPost(this.postId, this.isReloaded)
      .subscribe(
        (res: any) => {
          this.post = res.post;
          this.isLoading = false;
          this.post.content = this.sanitizer.bypassSecurityTrustHtml(
            this.post.content
          );
          this.author = res.user;
        },
        (error) => {
          this.isLoading = false;
          this._snackBar.open(error.error.message, null, {
            duration: 5000,
          });
        }
      );
  }

  share(e) {
    this.increseSub$ = this.postService.increaseShare(this.postId).subscribe(
      () => {},
      (err) => {}
    );
  }



  ngOnDestroy() {
    if (typeof this.postSub !== 'undefined') {
      this.postSub.unsubscribe();
    }
    if (typeof this.increseSub$ !== 'undefined') {
      this.increseSub$.unsubscribe();
    }
  }
}
