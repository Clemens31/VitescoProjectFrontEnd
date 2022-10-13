import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { HomeComponent } from 'src/app/home/home.component';
import { AuthService } from 'src/app/manager/authentification/auth.service';
import { ManagerModel } from 'src/app/models/manager.model';

@Component({
  selector: 'app-side-bar-menu',
  templateUrl: './side-bar-menu.component.html',
  styleUrls: ['./side-bar-menu.component.css'],
})
export class SideBarMenuComponent implements OnInit {

  constructor(private authService: AuthService,
    private home : HomeComponent) { }

  ngOnInit(): void {
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

  /*********************************************/
  /* Open Pop up List Arrivals */
  /*********************************************/

  openCurrentArrivalsList() {
    // Open pop up
    this.home.openCurrentArrivalsList();
  }

  
  /*********************************************************** */
  /** Departure */
  /*********************************************************** */
  openDeparturePage() {
    alert("Not Yet implemented");
  }

  /*********************************************************** */
  /** Profile */
  /*********************************************************** */
  openProfile() {
    alert("Not Yet implemented");
  }

  /*********************************************************** */
  /** About Us */
  /*********************************************************** */
  openAboutUs() {
    alert("Not Yet implemented");
  }


  /*********************************************************** */
  /** Support */
  /*********************************************************** */

  openSupport() {
    alert("Not Yet implemented");
  }

  /*********************************************************** */
  /** Deconnexion */
  /*********************************************************** */
  
  /** Deconnexion */
  logout() {
    this.authService.logout();
  }

}
