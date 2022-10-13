import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { Arrival } from 'src/app/models/arrival';
import { ArrivalService } from 'src/app/service/arrival.service';
import { Constants } from 'src/app/utils/constants';

@Component({
  selector: 'app-pop-confirm-delete',
  templateUrl: './pop-confirm-delete.component.html',
  styleUrls: ['./pop-confirm-delete.component.css']
})
export class PopConfirmDeleteComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Data   */
  /* **********************************  */
  @Input()
  arrival: Arrival;


  /* **********************************  */
  /* Section Successfull  */
  /* **********************************  */

  /* If recording completed */
  isCancel: string;


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
  sendPopupCancel = new EventEmitter();

  constructor(private spinner: NgxSpinnerService,
    private arrivalService: ArrivalService,
    private translate : TranslateService,
    private router : Router) {
    super();
   }

  ngOnInit(): void {
  }

  /* Call the back end to cancel the arrival */
  onDeleteArrival() {

    // Loader
    this.spinner.show();

    // Clean message valid 
    this.isCancel = "";

    // Clean message error and additionalInformations
    this.errorField = "";

    // Call back end
    this.subscriptions.push(
      this.arrivalService.deleteArrival(this.arrival).subscribe({
        next: () => {

          console.log(Constants.DELETE_ARRIVAL_MESSAGE);
          this.isCancel = Constants.DELETE_ARRIVAL_MESSAGE;

          // Redirect to Home page
          setTimeout(() => {
            
            this.isCancel = "";
            this.router.navigate(["/home"]);
          }, 5000);

          /** Display loader */
          this.spinner.hide();

        },

        error: (err: any) => {

          console.log("The arrival hasn't been deleted : "+ JSON.stringify(err));

          if(err.status == 400) {
            this.errorField = JSON.stringify(err.error);

          } else if (err.status == 401) {
            this.translate.get("registration.registrationError401").subscribe((data: any) => {
              this.errorField = data;
            });
          } else if (err.status == 401) {
            this.translate.get("globals.serverDown").subscribe((data: any) => {
              this.errorField = data;
            });
          } else {
            this.errorField = JSON.stringify(err);
          }

          /** Display loader */
          this.spinner.hide();
        } 
      })
    );

  }

  /* Close Pop up after click on cross */
  closePopup() {
    this.sendPopupCancel.emit();
  }

}
