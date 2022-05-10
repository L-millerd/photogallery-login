import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PhotoDetailsComponent} from './photo-details/photo-details.component'
import { PhotosComponent } from './photos/photos.component';
import { EmployeesComponent} from './employees/employees.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: 'photos', component: PhotosComponent},
  {path: 'photos/:id', component: PhotoDetailsComponent},
  {path: 'employees', component: EmployeesComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
