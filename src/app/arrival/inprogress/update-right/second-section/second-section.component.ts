import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Input, Output } from '@angular/core';
import { Arrival } from 'src/app/models/arrival';
import { AbstractSubscription } from 'src/app/core/subscription';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArrivalService } from 'src/app/service/arrival.service';
import { ArrivalUpdateService } from 'src/app/arrival/arrival-update-service';
import { StatutEnum } from 'src/app/enum/StatutEnum';
import { TcAccessEnum } from 'src/app/enum/TcAccessEnum';
import { YesOrNotEnum } from 'src/app/enum/YesOrNotEnum';
import { Constants } from 'src/app/utils/constants';

@Component({
  selector: 'app-second-section',
  templateUrl: './second-section.component.html',
  styleUrls: ['./second-section.component.css']
})
export class SecondSectionComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Data   */
  /* **********************************  */

  @Input()
  arrival: Arrival;

  hilString: string;
  statut: string;
  optionListStatut: any[] = [];

  /* **********************************  */
  /* Build Form   */
  /* **********************************  */

  /** FormGroup */
  updateSecondSectionRightsForm: FormGroup;


  /* **********************************  */
  /* Functional Intelligence   */
  /* **********************************  */
  selectACategory: string;


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

  /* **********************************  */
  /* Send information to parent to refresh Arrival */
  /* **********************************  */

  @Output() 
  sendRefreshArrival = new EventEmitter();

  constructor(private translate : TranslateService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private arrivalService: ArrivalService,
    private arrivalUpdateService: ArrivalUpdateService) { 
      super()
    }

  ngOnInit(): void {

    /** Display loader */
    this.spinner.show();

    /** Init Form */
    this.initSecondSectionRightForm();

    /** Init all Fields */
    this.initAllFields();

    /** Hide loader */
    this.spinner.hide();
  }

  /** Init all Fields */
  initAllFields() {

    this.translate.get("arrival.createEmployee.selectACategory").subscribe((data: any) => {
      this.selectACategory = data;

      /** Init Field Access Hil */
      this.initFieldAccessHil();

      /** Init Field Statut */
      this.initFieldStatut();

    });
  
  }

  /** Init form */
  initSecondSectionRightForm() {
    this.updateSecondSectionRightsForm = this.formBuilder.group({
      statut: new FormControl(null, []),
      reference: new FormControl(this.arrival.hil && this.arrival.hil.reference ? this.arrival.hil.reference : null, []),
    })
  }

  /** Init Field Access Hil */
  initFieldAccessHil() {
    
    const yesOrNotKeyEnum = Object.keys(YesOrNotEnum);
    const yesOrNotValuesEnum = Object.values(YesOrNotEnum);

    if(this.arrival.hil && this.arrival.hil.hil) {
      
      for(let yesOrNo of yesOrNotKeyEnum) {
        if(yesOrNo.toLowerCase() == this.arrival.hil.hil.toLowerCase()) {
          this.hilString = yesOrNotValuesEnum[yesOrNotKeyEnum.indexOf(yesOrNo)];
        }
      }
    }

  }

  /** Init Field Statut */
  initFieldStatut() {

    const statutEnumKeyList = Object.keys(StatutEnum);
    const statutEnumList = Object.values(StatutEnum);

    for(let statutEnum of statutEnumKeyList) {

      // If Hil Access is not required
      if(this.hilString.toLowerCase() == YesOrNotEnum.NO.toLowerCase()) {
        this.statut = statutEnumList[3];
      }

      // If statut already saved
      if(this.arrival.hil.statut && 
        statutEnum.toLowerCase() == this.arrival.hil.statut.toLowerCase()) {
        this.optionListStatut.unshift(statutEnumList[statutEnumKeyList.indexOf(statutEnum)]);
      }
      // If statut is null
      else {

        // Add select a category if list is empty
        if(this.optionListStatut.length == 0 && !this.arrival.hil.statut) {
          this.optionListStatut.push(this.selectACategory);
        }
        // Add all possibilities
        this.optionListStatut.push(statutEnumList[statutEnumKeyList.indexOf(statutEnum)]);
      }

    }
    

  }

  /* Update */
  onSubmitForm() {

    /** Display loader */
    this.spinner.show();

    // Re init the recording completed
    this.recordingCompleted ="";

    // Re init all errors
    this.errorField = "";

    try {

      let arrivalToUpdated = this.arrivalUpdateService.checkInformationRightsSecondSection(
        this.updateSecondSectionRightsForm.value, this.arrival, this.selectACategory, this.hilString);

      /** Call back end for update the new Arrival */ 
      this.updateRights(arrivalToUpdated);

      /** Hide loader */
      this.spinner.hide();

      
    } catch (e) {

      /* Subscribe erros */
      this.errorField = JSON.stringify(this.arrivalUpdateService.errorField);
      console.log(JSON.stringify(this.errorField));

      /** Hide loader */
      this.spinner.hide();
    }

  }

    /*********************************************/
  /* Update Rights */
  /*********************************************/

  /** Call back end for the update */
  updateRights(arrivalToUpdated: Arrival) {

    /** Call back end for update the new Arrival */ 
    this.subscriptions.push(
      this.arrivalService.updateRightSecondSection(arrivalToUpdated).subscribe({
        
        next: (value: Arrival) => {
          
        console.log("Update successfull");
        this.recordingCompleted = Constants.UPDATE_COMPLETED;

        // Clean message error
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
          console.log("Error update Rights Second Section : "+ JSON.stringify(err));

          // Delete the message sucessfull
          this.recordingCompleted = "";

          // Display error
          this.errorField = JSON.stringify(err);

          // Send information to the parent to refresh component
          this.refreshArrival();
        }      
      })
    );
  }

  /* Call parent for refresh Arrival */
  refreshArrival() {
    this.sendRefreshArrival.emit();
  }

}
