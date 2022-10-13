import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthentificationComponent } from './manager/authentification/authentification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './manager/services/auth-guard.service';
import { SideBarMenuComponent } from './header/side-bar-menu/side-bar-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RoleManagementComponent } from './role-management/role-management.component';
import { Methods } from './utils/methods';
import { RegisterComponent } from './manager/register/register.component';
import { ManagerService } from './manager/services/manager.service';
import { AuthService } from './manager/authentification/auth.service';
import { TokenInterceptorService } from './manager/services/token-interceptor.service';
import { PopUpEditManagerComponent } from './role-management/pop-up-edit-manager/pop-up-edit-manager.component';
import { PopUpDeleteManagerComponent } from './role-management/pop-up-delete-manager/pop-up-delete-manager.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxSpinnerModule } from "ngx-spinner";
import { InprogressComponent } from './arrival/inprogress/inprogress.component';
import { CreationEmployeeComponent } from './arrival/creation-employee/creation-employee.component';
import { PlaceOfActivityService } from './service/place-of-activity.service';
import { ArrivalCreationService } from './arrival/arrival-creation-service';
import { SchoolService } from './service/school.service';
import { CompanyService } from './service/company.service';
import { TypeOfContractService } from './service/type-of-contract.service';
import { PlatformService } from './service/platform.service';
import { ComputerModelService } from './service/computer-model.service';
import { ComputerTypeService } from './service/computer-type.service';
import { EquipmentService } from './service/equipment.service';
import { ArrivalService } from './service/arrival.service';
import { CurrentArrivalsListComponent } from './current-arrivals-list/current-arrivals-list.component';
import { UpdateEmployeeComponent } from './arrival/inprogress/update-employee/update-employee.component';
import { UpdateArrivalComponent } from './arrival/inprogress/update-arrival/update-arrival.component';
import { UpdateOrderComponent } from './arrival/inprogress/update-order/update-order.component';
import { UpdateEquipmentComponent } from './arrival/inprogress/update-equipment/update-equipment.component';
import { UpdateSchoolCompanyComponent } from './arrival/inprogress/update-school-company/update-school-company.component';
import { UpdateRightComponent } from './arrival/inprogress/update-right/update-right.component';
import { UpdateCommentComponent } from './arrival/inprogress/update-comment/update-comment.component';
import { DatePipe } from '@angular/common';
import { ArrivalUpdateService } from './arrival/arrival-update-service';
import { PopupUpdateArrivalComponent } from './arrival/inprogress/update-arrival/popup-update-arrival/popup-update-arrival.component';
import { IdCardComponent } from './arrival/inprogress/id-card/id-card.component';
import { PopConfirmCloseComponent } from './arrival/inprogress/id-card/pop-confirm-close/pop-confirm-close.component';
import { PopConfirmDeleteComponent } from './arrival/inprogress/id-card/pop-confirm-delete/pop-confirm-delete.component';
import { FirstSectionComponent } from './arrival/inprogress/update-right/first-section/first-section.component';
import { SecondSectionComponent } from './arrival/inprogress/update-right/second-section/second-section.component';
import { ThirdSectionComponent } from './arrival/inprogress/update-right/third-section/third-section.component';
import { FourthSectionComponent } from './arrival/inprogress/update-right/fourth-section/fourth-section.component';



// AoT requires an exported function for factories - For Module Tranlate
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


const routes: Routes = [
  // Main Page
  { path: '', canActivate:[AuthGuard], component: HomeComponent },
  { path: 'auth', component: AuthentificationComponent },
  { path: 'registration', component: RegisterComponent },
  { path: 'home', component: HomeComponent},
  { path: 'arrival/create-arrival', component: CreationEmployeeComponent },
  { path: 'arrival/inprogress/:id', component: InprogressComponent },
  { path: 'role-management', component: RoleManagementComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NotFoundComponent,
    AuthentificationComponent,
    SideBarMenuComponent,
    RoleManagementComponent,
    RegisterComponent,
    PopUpEditManagerComponent,
    PopUpDeleteManagerComponent,
    IdCardComponent,
    UpdateEmployeeComponent,
    InprogressComponent,
    CreationEmployeeComponent,
    CurrentArrivalsListComponent,
    UpdateArrivalComponent,
    UpdateOrderComponent,
    UpdateEquipmentComponent,
    UpdateSchoolCompanyComponent,
    UpdateRightComponent,
    UpdateCommentComponent,
    PopupUpdateArrivalComponent,
    PopConfirmCloseComponent,
    PopConfirmDeleteComponent,
    FirstSectionComponent,
    SecondSectionComponent,
    ThirdSectionComponent,
    FourthSectionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({ 
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  RouterModule.forRoot(routes),
  FormsModule,
  ReactiveFormsModule,
  BrowserAnimationsModule,
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatDividerModule,
  Ng2SearchPipeModule, // Filter Search Manager
  NgxSpinnerModule // Loader
  ],
  providers: [AuthService, AuthGuard, ArrivalCreationService, 
    Methods, ManagerService, AuthentificationComponent, PlaceOfActivityService, 
    TypeOfContractService, SchoolService, CompanyService, PlatformService, ComputerModelService,
    ComputerTypeService, EquipmentService, ArrivalService, HomeComponent, DatePipe,
    ArrivalUpdateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Loader
})

export class AppModule { }
