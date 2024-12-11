import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterPageComponent } from './pages/register/register';
import { EmployeeManagementComponent } from './pages/employeeManagement/employeeManagement';
import { LoginPageComponent } from './pages/login/login';
import { HeaderComponent } from './partial/header/header';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RandevuAlComponent } from './pages/randevuAl/randevuAl';
import { HomeComponent } from './pages/home/home';
import { RandevuGoruntuleComponent } from './pages/randevuGoruntule/randevuGoruntule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AdminPanelComponent } from './pages/adminPanel/adminPanel';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { ServiceManagementComponent } from './pages/ServiceManagement/ServiceManagement';
import { ServiceAssignmentComponent } from './pages/ServiceAssignment/ServiceAssignment';
import { MatDialogModule } from '@angular/material/dialog';
import { EmployeeServiceComponent } from './pages/EmployeeService/EmployeeService';
import { MatTableModule } from '@angular/material/table';
import { AppointmentManagementComponent } from './pages/appointmentManagement/appointmentManagement';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HairAdviceAIComponent } from './pages/hairAdviceAI/hairAdviceAI';
import { NgxSpinnerModule } from "ngx-spinner";
 
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginPageComponent,
    RegisterPageComponent,
   RandevuAlComponent,
    RandevuGoruntuleComponent,
    HomeComponent,
    AdminPanelComponent,
    EmployeeManagementComponent,
    ServiceManagementComponent,
    ServiceAssignmentComponent,
    EmployeeServiceComponent,
    AppointmentManagementComponent,
    HairAdviceAIComponent
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      newestOnTop: false,
    }),
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatDialogModule,
    MatTableModule,
    MatToolbarModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    NgxSpinnerModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }, provideAnimationsAsync(),],
  bootstrap: [AppComponent]
})
export class AppModule { }
