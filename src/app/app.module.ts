import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule, Routes, UrlSerializer } from '@angular/router';
import { UploadComponent } from './upload/upload.component';

import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { FormsModule } from '@angular/forms';

import{ AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { HelperService } from './services/helper.service';

import{ FunkollectionApiService } from './services/funkollection-api.service';

import { LoginModel } from './models/loginModel';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FunkopopComponent } from './funkopop/funkopop.component';
import { DefaultUrlSerializer, UrlTree } from '@angular/router';

// Import your library
import { CountdownTimerModule } from 'ngx-countdown-timer';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CollectionComponent } from './collection/collection.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';

export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
    parse(url: string): UrlTree {

        return super.parse(url.toLowerCase()); 

    }
}

const appRoutes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '', 
      component: HomeComponent,
      canActivate: [AuthGuard],
      children: [
        { path: '', pathMatch: 'full', redirectTo: 'dashboard'},
        { path: 'dashboard', component: DashboardComponent},
        { path: 'collection', component: CollectionComponent}, 
        { path: 'wishlist', component: WishlistComponent}, 
        { path: 'disclaimer', component: DisclaimerComponent}, 
        { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
        { path: 'funko/:series/:category/:name', component: FunkopopComponent},
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
    ResetPasswordComponent,
    DashboardComponent,
    FunkopopComponent,
    CollectionComponent,
    WishlistComponent,
    DisclaimerComponent,
  ],
  imports: [
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    CountdownTimerModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true}
    )
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [AuthGuard, 
    AuthService, 
    HelperService, 
    FunkollectionApiService, 
    LoginModel, 
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
