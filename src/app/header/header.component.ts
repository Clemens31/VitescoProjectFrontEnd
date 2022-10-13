import { Component, ElementRef, Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../manager/authentification/auth.service';
import { ManagerService } from '../manager/services/manager.service';
import { ManagerModel } from '../models/manager.model';
import { RoleEnum } from '../models/role.enum';
import { Constants } from '../utils/constants';

@Component({
  host: { '(document:click)': 'onClick($event)'},
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  /** Icon Menu Initial */
  iconMenu: string = Constants.ICON_MENU_BURGER;
  imgAccount: string = Constants.ICON_MYACCOUNT;

  /** Icon Languages */
  iconFR: string = Constants.ICON_FR_LANGUAGES;
  iconEN: string = Constants.ICON_EN_LANGUAGES;

  /** Image Vitesco */
  imgVitesco: string = Constants.IMAGE_LOGO_VITESCO;

  /** Open the side bar menu */
  display = false;

  /* Manager */
  manager: ManagerModel;
  managerIsAdmin : boolean = false;
  managerIsSHD_SHD : boolean = false;
  manag : boolean = false;

  constructor(private translateService : TranslateService,
              private _eref: ElementRef,
              public authService: AuthService,
              private spinner : NgxSpinnerService,
              private home : HomeComponent) { 

                
  }

  ngOnInit() {

    // Loader 
    this.spinner.show();

    if(this.authService.currentManager == null) {
    } else {
      this.manager = this.authService.currentManager;
      this.managerIsSHD_SHD = this.authService.managerIsShdResponsible;
      this.managerIsAdmin = this.authService.managerIsAdmin;
    }

    // Disabled loader
    this.spinner.hide();

  }

  /** Change the language */
  public selectLanguage(lang: string) {
    this.translateService.use(lang);
  }

  /*********************************************/
  /* Open Pop up List Arrivals */
  /*********************************************/

  openCurrentArrivalsList() {

    // Open pop up
    this.home.openCurrentArrivalsList();
  }

  /** Open the menu */
  openMenu() {
    this.display = !this.display;
    if(this.display) {
      this.iconMenu = Constants.ICON_CLOSE_BURGER;
    } else {
      this.iconMenu = Constants.ICON_MENU_BURGER
    }
  }

  /** Close the menu when click is outside */
  onClick(event: { target: any; }) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.display = false;
      this.iconMenu = Constants.ICON_MENU_BURGER
    }
  }

  /*********************************************************** */
  /** Deconnexion */
  /*********************************************************** */
  
  /** Deconnexion */
  logout() {
    this.authService.logout();
  }

  /*********************************************************** */
  /** Role */
  /*********************************************************** */

  get isAdmin(): boolean {
    return this.authService.isManagerAdmin(this.authService.currentManager);
  }

  get isOnlyUser(): boolean {
    return this.authService.isOnlyUser(this.authService.currentManager);
  }

  get isManagerSHD_SHD(): boolean {
    return this.authService.isManagerSHD_SHD(this.authService.currentManager);
  }


  /*********************************************************** */
  /** Departure */
  /*********************************************************** */
  openDeparturePage() {
    alert("Not Yet implemented");
  }

  /*********************************************************** */
  /** Support */
  /*********************************************************** */

  openSupport() {
    alert("Not Yet implemented");
  }

  /*********************************************************** */
  /** Mouse hover */
  /*********************************************************** */

  /** Change the icon menu when mouse hover */
  onMouseOver(): void {
    if(!this.display) {
      this.iconMenu = Constants.ICON_MENU_BURGER_HOVER;
    } else {
      this.iconMenu = Constants.ICON_CLOSE_BURGER_HOVER;
    }
   }

  /** Change the icon menu when mouse isn't hover */
  onMouseOut(): void {
    if(!this.display) {
      this.iconMenu = Constants.ICON_MENU_BURGER;
    } else {
      this.iconMenu = Constants.ICON_CLOSE_BURGER;
    }
  }

  /** Change the icon account when mouse hover */
  onMouseOverAccount(): void {
    this.imgAccount = Constants.ICON_MYACCOUNT_HOVER;
    }

  /** Change the account menu when mouse isn't hover */
  onMouseOutAccount(): void {
    this.imgAccount = Constants.ICON_MYACCOUNT;
  }


}
