import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SystemRoutingModule } from './system-routing.module';
import { QuillModule } from 'ngx-quill';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PostsComponent } from './posts/posts.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PostViewComponent } from './post-view/post-view.component';
import { UserViewComponent } from './user-view/user-view.component';

import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { WINDOW_PROVIDERS } from '../service/window.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    NavbarComponent,
    DashboardComponent,
    PostsComponent,
    HomeComponent,
    SidebarComponent,
    PostViewComponent,
    UserViewComponent,
    LoginComponent,
    SignupComponent,
    ToolbarComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    NgbDropdownModule,
    FontAwesomeModule,
    NgApexchartsModule,
    SystemRoutingModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
  ],
  providers: [WINDOW_PROVIDERS],
})
export class SystemModule {}
