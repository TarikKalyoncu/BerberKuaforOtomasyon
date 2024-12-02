import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login/login';
import { RegisterPageComponent } from './pages/register/register';


const routes: Routes = [
  { path: 'auth/register', component: RegisterPageComponent },
  { path: 'auth/login', component: LoginPageComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
