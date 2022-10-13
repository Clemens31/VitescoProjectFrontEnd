import { Component, OnInit } from '@angular/core';
import { AuthService } from '../manager/authentification/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /** Open the pop up for select an arrival */
  displayArrivalsList : boolean = false;

  constructor(private authService : AuthService) { }

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
  /* Open Pop up */
  /*********************************************/

  openCurrentArrivalsList() {
    // Open pop up
    this.displayArrivalsList = true;
  }

  /*********************************************/
  /* Close Pop up */
  /*********************************************/

  /** Close the Pop Up when the cross is pressed */
  closePopupCurrentArrivals() {
    this.displayArrivalsList = false;
  }


  /*********************************************************** */
  /** Departure */
  /*********************************************************** */
  openDeparturePage() {
    alert("Not Yet implemented");
  }

}
