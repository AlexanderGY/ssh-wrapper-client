import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
/**
 * Components
 */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { PublishComponent } from './publish/publish.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {NgPipesModule} from 'ngx-pipes';
/**
 * Services
 */
import { MenuService } from './header/menu.service';
import { BackService } from './header/back.service';

/**
 * Routes
 * @type {Array}
 */
const ROUTES = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    PublishComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ang4-seo-pre'}),
    FormsModule,
    NgPipesModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    NgbModule.forRoot(),
    FileUploadModule
  ],
  providers: [MenuService, BackService],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
