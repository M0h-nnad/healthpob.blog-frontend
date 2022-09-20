import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from 'src/app/service/posts/posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../../models/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss'],
})
export class BlogPostsComponent implements OnInit, OnDestroy {
  posts: Post[];
  temp;
  isLoading: boolean = true;
  postCount: number;
  postSubscription: Subscription;
  pager = {
    page: 1,
    size: 9,
    count: 0,
  };
  constructor(
    private postService: PostsService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.postSubscription = this.postService
      .getAllPosts(this.pager.size, this.pager.page)
      .subscribe(
        (res: any) => {
          this.temp = res.Posts;
          this.posts = this.temp;
          this.postCount = res.count;
          for (let post of this.posts) {
            this.covertHTMLToText(post);
          }
          this.pager.count = res.count;
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

  readMore(id) {
    this.router.navigate(['/blog/post/' + id]);
  }

  onChangePage() {
    // const currentPage = pageEvent.pageIndex + 1;
    this.pager.page += 1;
    this.postService.getAllPosts(this.pager.size, this.pager.page).subscribe(
      (res: any) => {
        this.temp = res.Posts;
        for (let post of this.temp) {
          this.covertHTMLToText(post);
        }
        this.posts.push(...this.temp);
        this.postCount = res.count;

        // this.postCount += res.count;
      },
      (error) => {
        this._snackBar.open(error.error.message, null, {
          duration: 5000,
        });
      }
    );
  }
  ngOnDestroy() {
    if (typeof this.postSubscription !== 'undefined') {
      this.postSubscription.unsubscribe();
    }
  }
}
