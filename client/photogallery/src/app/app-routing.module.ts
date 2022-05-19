import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PhotoDetailsComponent} from './photo-details/photo-details.component'
import { PhotosComponent } from './photos/photos.component';
import { EmployeesComponent} from './employees/employees.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SignupComponent } from './signup/signup.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { PostsComponent } from './posts/posts.component';

const routes: Routes = [
  {path: 'photos', component: PhotosComponent},
  {path: 'photos/:id', component: PhotoDetailsComponent},
  {path: 'employees', component: EmployeesComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'updateUser', component: UpdateUserComponent},
  {path: '', component: PostsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
