import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { PostsComponent } from './posts/posts.component';
import { PostViewComponent } from './post-view/post-view.component';
import { UserViewComponent } from './user-view/user-view.component';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { AuthGuard } from '../service/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  children: [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'posts', component: PostsComponent, canActivate: [AuthGuard] },
    { path: 'post', component: PostViewComponent, canActivate: [AuthGuard] },
    {
      path: 'post/:id',
      component: PostViewComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'user/:id',
      component: UserViewComponent,
      canActivate: [AuthGuard],
    },
  ],
}]

@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule],
})

export class SystemRoutingModule {}
