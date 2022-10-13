import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { Arrival } from 'src/app/models/arrival';
import { ArrivalService } from 'src/app/service/arrival.service';
import { Constants } from 'src/app/utils/constants';

@Component({
  selector: 'app-pop-confirm-close',
  templateUrl: './pop-confirm-close.component.html',
  styleUrls: ['./pop-confirm-close.component.css']
})
export class PopConfirmCloseComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Data   */
  /* **********************************  */
  @Input()
  arrival: Arrival;


  /* **********************************  */
  /* Section Successfull  */
  /* **********************************  */

  /* If recording completed */
  isArchived: string;


  /* **********************************  */
  /* Section Errors  */
  /* **********************************  */

  /** List messages Errors */
  errorField : string;


  /* **********************************  */
  /* Interaction  */
  /* **********************************  */

  /* Send information to parent if pop up is closed */
  @Output() 
  sendPopupClose = new EventEmitter();

  constructor(private spinner: NgxSpinnerService,
    private arrivalService: ArrivalService,
    private translate : TranslateService,
    private router : Router) { 
    super();
  }

  ngOnInit(): void {
  }

  /* Call the back end to close the arrival */
  onCloseArrival() {

    // Loader
    this.spinner.show();

    // Clean message valid 
    this.isArchived = "";

    // Clean message error and additionalInformations
    this.errorField = "";

    // Call back end
    this.subscriptions.push(
      this.arrivalService.closeArrival(this.arrival).subscribe({

        next: () => {
          console.log("The arrival has been set to archived status");

          this.isArchived = Constants.CLOSE_ARRIVAL_MESSAGE;

          // Redirect to Home page
          setTimeout(() => {
            
            this.isArchived = "";
            this.router.navigate(["/home"]);
        }, 5000);

          /** Display loader */
          this.spinner.hide();

        },

        error: (err: any) => {

          console.log("The arrival hasn't been set to archived status : "+ JSON.stringify(err));

          if(err.status == 400) {
            this.errorField = JSON.stringify(err.error);
            console.log(JSON.stringify(err.error));

          } else if (err.status == 409) {
            this.translate.get("registration.registrationError409").subscribe((data: any) => {
              this.errorField = data;
            });
          } else if (err.status == 404) {
            this.translate.get("registration.registrationError404").subscribe((data: any) => {
              this.errorField = data;
            })
          } else if (err.status == 401) {
            this.translate.get("registration.registrationError401").subscribe((data: any) => {
              this.errorField = data;
            });
          } else {
            this.translate.get("globals.serverDown").subscribe((data: any) => {
              this.errorField = data;
            });
          }

          /** Display loader */
          this.spinner.hide();
        } 
      })
    );
  }

  /* Close Pop up after click on cross */
  closePopup() {
    this.sendPopupClose.emit();
  }

}
