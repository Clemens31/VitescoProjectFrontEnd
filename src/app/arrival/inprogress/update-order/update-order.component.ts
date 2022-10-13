import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { Arrival } from 'src/app/models/arrival';
import { ArrivalService } from 'src/app/service/arrival.service';
import { Constants } from 'src/app/utils/constants';
import { ArrivalUpdateService } from '../../arrival-update-service';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css']
})
export class UpdateOrderComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Data   */
  /* **********************************  */

  @Input()
  arrival: Arrival;
  isExternal: boolean = false;
  startOfOrderPeriod: string | null;
  endOfOrderPeriod: string | null;

  /* **********************************  */
  /* Build Form   */
  /* **********************************  */

  /** FormGroup */
  updateOrderForm: FormGroup;

  /* **********************************  */
  /* Send information to parent to refresh Arrival */
  /* **********************************  */

  @Output() 
  sendRefreshArrival = new EventEmitter();

  /* **********************************  */
  /* Section Successfull  */
  /* **********************************  */

  /* If recording completed */
  recordingCompleted: string;


  /* **********************************  */
  /* Section Errors  */
  /* **********************************  */

  /** List messages Errors */
  errorField : string;


  constructor(
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public arrivalUpdateService: ArrivalUpdateService,
    private arrivalService: ArrivalService,
    private translate: TranslateService,
    private datePipe: DatePipe) {
      super()
     }

  ngOnInit(): void {

    /** Display loader */
    this.spinner.show();

    /** Init all Fields */
    this.initFields();

    /** Init Form */
    this.initUpdateArrivalForm();

    /** Hide loader */
    this.spinner.hide();
  }

  /** Init all fields */
  initFields() {

    /* Detect if we can update the order */
    if(this.arrival && this.arrival.typeOfContract.name.toLowerCase() == Constants.EXTERNE.toLowerCase()) {
      this.isExternal = true;
    } else {
      this.isExternal = false;
    }

  }

  /** Init Arrival */
  initUpdateArrivalForm() {

    /** 
     * Check if Order exists 
     * 
    */ 

    // Start
    if(this.arrival && this.arrival.order && this.arrival.order.startOfOrderPeriod) {

      // Cast to date format
      this.startOfOrderPeriod = this.arrival.order.startOfOrderPeriod ?  
        this.datePipe.transform(this.arrival.order.startOfOrderPeriod,'yyyy-MM-dd') : 
        null;
    }

    // End
    if(this.arrival && this.arrival.order && this.arrival.order.endOfOrderPeriod) { 

      // Cast to date format
      this.endOfOrderPeriod = this.arrival.order.endOfOrderPeriod ? 
        this.datePipe.transform(this.arrival.order.endOfOrderPeriod,'yyyy-MM-dd') : 
        null;
    }

    // Put "null" the value if arrival and order doesn't exists
    if(this.arrival && !this.arrival.order) {
      this.startOfOrderPeriod = null;
      this.endOfOrderPeriod = null;
    }


    /** FormBuilder */
    this.updateOrderForm = this.formBuilder.group({
      orderNumber: new FormControl(this.arrival.order && this.arrival.order.order_number ? 
        this.arrival.order.order_number : 
        null, []),
      startOfOrderPeriod: new FormControl(this.startOfOrderPeriod, []),
      endOfOrderPeriod: new FormControl(this.endOfOrderPeriod, []),
    })

  };

  /*********************************************/
  /* Submit */
  /*********************************************/
  onSubmitForm() {

    /** Display loader */
    this.spinner.show();

    // Re init the recording completed
    this.recordingCompleted ="";

    // Re init all errors
    this.errorField = "";

    // Call service for check information
    try {
      let arrivalToUpdated = this.arrivalUpdateService.checkInformationsOrderUpdate(
        this.updateOrderForm.value, this.arrival);

        /* If everything is good */
        if(!this.errorField || this.errorField != null || this.errorField == "") {

          /** Call back end for update the new order */
          this.updateOrder(arrivalToUpdated);

          /** Display loader */
          this.spinner.hide();

        }

    } catch (e) {

      /* Subscribe erros */
      this.errorField = this.arrivalUpdateService.errorField;
      console.log(this.errorField);

      /** Hide loader */
      this.spinner.hide();
    }

  }

  /*********************************************/
  /* Update Arrival */
  /*********************************************/
  updateOrder(arrivalToUpdated: Arrival) {

    /** Call back end for the update */
    this.subscriptions.push(
      this.arrivalService.updateOrder(arrivalToUpdated).subscribe({

        next: (value: Arrival) => {

          console.log("Update successfull");
          this.recordingCompleted = Constants.UPDATE_COMPLETED;

          // Clean message error and additionalInformations
          this.errorField = "";

          // Send information to the parent to refresh component
          this.refreshArrival();

          /** Display loader */
          this.spinner.hide();

          /* Remove message after 5sec */
          setTimeout(() => {
            // Call the setDelay function again with the remaining times
            this.recordingCompleted = "";
          }, 5000);
        },

        error: (err: any) => {
          console.log("Error update Arrival : "+ JSON.stringify(err));

          // Delete the message sucessfull
          this.recordingCompleted = "";

          // Clean message error and additionalInformations
          this.arrivalUpdateService.additionalInformations = [];

          this.errorField = JSON.stringify(err.error);
          console.log(JSON.stringify(err.error));

          if(err.status == 400) {
            
          // Send information to the parent to refresh component
          this.refreshArrival();
        }    

      }

      })
    )
  }

  /* Emit for parent refresh Arrival */
  refreshArrival() {
    this.sendRefreshArrival.emit();
  }

}
