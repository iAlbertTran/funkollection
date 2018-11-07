import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';

import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { FormsModule } from '@angular/forms';

import{ AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

import{ FunkollectionApiService } from './services/funkollection-api.service';

import { LoginModel } from './models/loginModel';

const appRoutes: Routes = [
  {path: '', component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'upload', component: UploadComponent}
    ]  
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'reset-password', component: ResetPasswordComponent}  
]
@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true}
    )
  ],
  providers: [AuthGuard, AuthService, FunkollectionApiService, LoginModel],
  bootstrap: [AppComponent]
})
export class AppModule { }
