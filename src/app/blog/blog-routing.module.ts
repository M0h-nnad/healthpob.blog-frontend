import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogUserViewComponent } from './blog-user-view/blog-user-view.component';
import { BlogHomeComponent } from './home/home.component';
import { BlogPostsComponent } from './blog-posts/blog-posts.component';
import { BlogUsersComponent } from './blog-users/blog-users.component';
import { BlogPostViewComponent } from './blog-post-view/blog-post-view.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    component: BlogHomeComponent,
    children: [
      {
        path: 'posts',
        component: BlogPostsComponent,
      },
      { path: 'search', component: SearchComponent },
      { path: 'doctors', component: BlogUsersComponent },
      { path: 'doctors/:id', component: BlogUserViewComponent },
      { path: 'post/:id', component: BlogPostViewComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
