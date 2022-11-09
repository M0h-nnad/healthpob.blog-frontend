import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import { BlogNavbarComponent } from './navbar/navbar.component';
import { BlogHomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BlogPostsComponent } from './blog-posts/blog-posts.component';
import { BlogUsersComponent } from './blog-users/blog-users.component';
import { BlogPostViewComponent } from './blog-post-view/blog-post-view.component';
import { BlogUserViewComponent } from './blog-user-view/blog-user-view.component';

import { MaterialModule } from '../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BlogRoutingModule } from './blog-routing.module';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    BlogHomeComponent,
    BlogNavbarComponent,
    HeaderComponent,
    FooterComponent,
    BlogPostsComponent,
    BlogUsersComponent,
    BlogPostViewComponent,
    BlogUserViewComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    BlogRoutingModule,
    ShareButtonsModule,
    ShareIconsModule
  ],
})
export class BlogModule {}
