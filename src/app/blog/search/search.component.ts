import { Component, OnInit } from '@angular/core';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { PostsService } from 'src/app/service/posts/posts.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  faEllipsis = faEllipsis;
  posts = [];

  pager = {
    page: 1,
    size: 9,
    count: 0,
  };
  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.postService.searchPostsArr.subscribe((post) => {
      this.posts = post;
    });
  }
}
