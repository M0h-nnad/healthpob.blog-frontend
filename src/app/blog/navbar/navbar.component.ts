import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/service/posts/posts.service';

@Component({
  selector: 'app-navbar-blog',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class BlogNavbarComponent implements OnInit {
  faSearch = faSearch;
  isModalOpen = false;
  faX = faX;
  searchVal = '';
  constructor(
    private postService: PostsService,
    private route: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}

  search() {
    this.postService.searchPosts(this.searchVal).subscribe((res: any) => {
      for (const post of res.posts) {
        this.covertHTMLToText(post);
      }
      this.postService.searchPostsArr = res.posts;

      this.route.navigate(['/blog/search']);

      this.isModalOpen = false;
    });
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
}
