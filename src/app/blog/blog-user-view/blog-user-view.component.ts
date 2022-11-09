import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostsService } from 'src/app/service/posts/posts.service';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { Post } from 'src/app/models/post.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-user-view',
  templateUrl: './blog-user-view.component.html',
  styleUrls: ['./blog-user-view.component.scss'],
})
export class BlogUserViewComponent implements OnInit, OnDestroy {
  temp;
  posts = [];
  postCount;
  user: User;
  userId: string;
  isLoading: boolean = true;
  userSubscription: Subscription;
  postSubs: Subscription;
  faEllipsis = faEllipsis;

  pager = {
    page: 1,
    size: 9,
    count: 0,
  };

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private postsService: PostsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (typeof this.userId === undefined) return (this.isLoading = false);
    this.userSubscription = this.authService.getUser(this.userId).subscribe(
      (res: any) => {
        this.user = res[0];
        // console.log(this.user)
        this.isLoading = false;
        this.getPosts();
      },
      (err) => {
        this.isLoading = false;
        this._snackBar.open(err.error.message, null, { duration: 5000 });
      }
    );
  }

  getPosts() {
    this.isLoading = false;
    this.postSubs = this.postsService
      .getUserPosts(this.userId, this.pager.size, this.pager.page)
      .subscribe(
        (res: any) => {
          this.temp = res.posts;
          this.pager.count = res.count;
          for (let post of this.temp) {
            this.covertHTMLToText(post);
          }
          this.posts.push(...this.temp);
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this._snackBar.open(error.error.message, null, {
            duration: 5000,
          });
        }
      );
  }

  covertHTMLToText(post: Post) {
    post.content = post.content.replace(/<\/div>/gi, '\n');
    post.content = post.content.replace(/<\/li>/gi, '\n');
    post.content = post.content.replace(/<li>/gi, ' * ');
    post.content = post.content.replace(/<\/ul>/gi, '\n');
    post.content = post.content.replace(/<\/p>/gi, '\n');
    post.content = post.content.replace(/<[^>]+>/gi, '');
    post.content = post.content.replace(/<br\s*[\/]?>/gi, '\n');
    post.content = this.sanitizer.bypassSecurityTrustHtml(post.content);
  }

  onChangePage() {
    this.pager.page += 1;
    this.getPosts();
  }

  ngOnDestroy() {
    if (typeof this.userSubscription !== 'undefined') {
      this.userSubscription.unsubscribe();
    }
  }
}
