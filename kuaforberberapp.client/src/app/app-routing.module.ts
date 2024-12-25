import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login/login';
import { RegisterPageComponent } from './pages/register/register';
import { AuthGuard } from './services/user.guard';
import { AdminGuard } from './services/admin.guard';
import { RandevuAlComponent } from './pages/randevuAl/randevuAl';
import { RandevuGoruntuleComponent } from './pages/randevuGoruntule/randevuGoruntule';
import { HomeComponent } from './pages/home/home';
import { AdminPanelComponent } from './pages/adminPanel/adminPanel';
import { EmployeeManagementComponent } from './pages/employeeManagement/employeeManagement';
import { ServiceManagementComponent } from './pages/ServiceManagement/ServiceManagement';
import { EmployeeServiceComponent } from './pages/EmployeeService/EmployeeService';
import { AppointmentManagementComponent } from './pages/appointmentManagement/appointmentManagement';
import { HairAdviceAIComponent } from './pages/hairAdviceAI/hairAdviceAI';


const routes: Routes = [
  { path: '', component: HomeComponent }, // Ana sayfa rotası
  { path: 'auth/login', component: LoginPageComponent },
  { path: 'auth/register', component: RegisterPageComponent },
  { path: 'randevu/goruntule', component: RandevuGoruntuleComponent, canActivate: [AuthGuard] }, // Giriş yapmadan bu sayfaya girilemez
  { path: 'randevu/al', component: RandevuAlComponent }, // Giriş yapmadan bu sayfaya girilemez
  { path: '', redirectTo: '/', pathMatch: 'full' }, // Varsayılan yönlendirme
  { path: 'admin/panel', component: AdminPanelComponent, canActivate: [AdminGuard] },
  { path: 'admin/panel/employee-management', component: EmployeeManagementComponent, canActivate: [AdminGuard] },
  { path: 'admin/panel/service-management', component: ServiceManagementComponent, canActivate: [AdminGuard] },
  { path: 'admin/panel/employee-services', component: EmployeeServiceComponent, canActivate: [AdminGuard] },
  { path: 'admin/panel/appointment-management', component: AppointmentManagementComponent, canActivate: [AdminGuard] },
  { path: 'hair-advice', component: HairAdviceAIComponent ,canActivate: [AuthGuard]}, // Yeni rota
   

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
