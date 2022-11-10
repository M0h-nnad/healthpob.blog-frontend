import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from 'src/app/service/posts/posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../../models/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss'],
})
export class BlogPostsComponent implements OnInit, OnDestroy {
  tabMode = 1;
  posts: Post[];
  isLoadingMore: boolean = false;
  temp;
  faEllipsis = faEllipsis;
  isLoading: boolean = true;
  postCount: number;
  postSubscription: Subscription;
  popularPosts = [];
  recentPosts = [];
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
    this.getAndAddHeaderPosts();
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
    this.isLoadingMore = true;
    // const currentPage = pageEvent.pageIndex + 1;
    this.pager.page += 1;
    this.postService.getAllPosts(this.pager.size, this.pager.page).subscribe(
      (res: any) => {
        this.isLoadingMore = false;
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

  getAndAddHeaderPosts() {
    console.log('workings');
    this.postService.getHeaderPosts().subscribe((res: any) => {
      this.popularPosts = res.popularPost;
      this.recentPosts = res.recentPost;

    console.log(this.popularPosts);

    });
  }
  ngOnDestroy() {
    if (typeof this.postSubscription !== 'undefined') {
      this.postSubscription.unsubscribe();
    }
  }
}
