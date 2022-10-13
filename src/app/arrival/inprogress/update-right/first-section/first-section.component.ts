import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Input, Output } from '@angular/core';

import { Arrival } from 'src/app/models/arrival';
import { NgxSpinnerService } from 'ngx-spinner';
import { TcAccessEnum } from 'src/app/enum/TcAccessEnum';
import { StatutEnum } from 'src/app/enum/StatutEnum';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/utils/constants';
import { AbstractSubscription } from 'src/app/core/subscription';
import { ArrivalService } from 'src/app/service/arrival.service';
import { ArrivalUpdateService } from 'src/app/arrival/arrival-update-service';
import { ThisReceiver } from '@angular/compiler';
import { ElectronicKeyEnum } from 'src/app/enum/ElectronicKeyEnum';

@Component({
  selector: 'app-first-section',
  templateUrl: './first-section.component.html',
  styleUrls: ['./first-section.component.css']
})
export class FirstSectionComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Data   */
  /* **********************************  */

  @Input()
  arrival: Arrival;

  tcAccessString: string;
  tcAccessStatut: string;
  optionListStatut: any[] = [];

  electronicKeyEmpty: string;
  electronickey: string;
  location: string;
  optionListStatutElectronicKey: any[] =  [];

  /* **********************************  */
  /* Build Form   */
  /* **********************************  */

  /** FormGroup */
  updateFirstSectionRightsForm: FormGroup;


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
    this.initFirstSectionRightForm();

    /** Init all Fields */
    this.initAllFields();

    /** Hide loader */
    this.spinner.hide();

  }

  /** Init form */
  initFirstSectionRightForm() {
    this.updateFirstSectionRightsForm = this.formBuilder.group({
      tcAccess: new FormControl(null, []),
      id: new FormControl(this.arrival.electronicKey && this.arrival.electronicKey.identifiant ? 
        this.arrival.electronicKey.identifiant : null, []),
      statutElectronicKey: new FormControl(null, [])
    })
  }

  /** Init all Fields */
  initAllFields() {

    this.translate.get("arrival.createEmployee.selectACategory").subscribe((data: any) => {
      this.selectACategory = data;

      /** Init Field TcAccess */
      this.initFieldTcAccess();

      /** Init Field Statut */
      this.initFieldStatut();

      /** Init Field ElectronicKey and other value in object */
      this.initFieldElectronicKey();

    });

  }

  /** Init Field TcAccess */
  initFieldTcAccess() {
    // Add list of Enum
    const tcAccessKeyList = Object.keys(TcAccessEnum);
    const tcAccessList = Object.values(TcAccessEnum);

    // Add tcAccess selected if object exists
   for(let tcAccess of tcAccessKeyList) {
      if(this.arrival.tcAccess && 
        this.arrival.tcAccess.tcAccess.toLowerCase() == tcAccess.toLowerCase()) {
          this.tcAccessString = tcAccessList[tcAccessKeyList.indexOf(tcAccess)];
      }
    } 
  }

  /** Init Field Statut */
  initFieldStatut() {

    const statutEnumKeyList = Object.keys(StatutEnum);
    const statutEnumList = Object.values(StatutEnum);

    for(let statutEnum of statutEnumKeyList) {

      // If tc Access is not required
      if(this.arrival.tcAccess.tcAccess.toLowerCase() == TcAccessEnum.NO.toLowerCase()) {
        this.tcAccessStatut = statutEnumList[3];
      }

      // If statut already saved
      if(this.arrival.tcAccess.statut && 
        statutEnum.toLowerCase() == this.arrival.tcAccess.statut.toLowerCase()) {
        this.optionListStatut.unshift(statutEnumList[statutEnumKeyList.indexOf(statutEnum)]);
      }
      // If statut is null
      else {

        // Add select a category if list is empty
        if(this.optionListStatut.length == 0 && !this.arrival.tcAccess.statut) {
          this.optionListStatut.push(this.selectACategory);
        }
        // Add all possibilities
        this.optionListStatut.push(statutEnumList[statutEnumKeyList.indexOf(statutEnum)]);
      }

    }
    

  }

  /** Init Field ElectronicKey */
  initFieldElectronicKey() {

    const statutEnumKeyList = Object.keys(StatutEnum);
    const statutEnumList = Object.values(StatutEnum);

    /** If ElectronicKey doesn't exists */
    if(!this.arrival.electronicKey) {

      // Update the field ID and Statut
      this.electronicKeyEmpty = statutEnumList[3];

      // Update the Electronic key and location
      this.translate.get("arrival.inProgress.updateRights.firstSection.none").subscribe((data: any) => {
        this.electronickey = data;
      });
      
    } /** If ElectronicKey exists  */
    else if (this.arrival.electronicKey && this.arrival.electronicKey.electronicKeyEnum) {

      const electronicKeyKeysList = Object.keys(ElectronicKeyEnum);
      const electronicKeyList = Object.values(ElectronicKeyEnum);

      // Loop list enum
      for (let ek of electronicKeyKeysList) {

        // Init value Electronic Key
        if(ek.toLowerCase() == this.arrival.electronicKey.electronicKeyEnum.toLowerCase()) {
          this.electronickey = electronicKeyList[electronicKeyKeysList.indexOf(ek)];
        }
      }

      // Update the location
      this.translate.get("arrival.inProgress.updateRights.firstSection.none").subscribe((data: any) => {
        this.location = this.arrival.electronicKey.location ? this.arrival.electronicKey.location : data;
      });

      // Update the Statut

      // If statut already saved
      if(this.arrival.electronicKey.statut) {

        for(let statut of statutEnumKeyList) {

          // If statut is selected
          if(statut.toLowerCase() == this.arrival.electronicKey.statut.toLowerCase()) {
            this.optionListStatutElectronicKey.unshift(statutEnumList[statutEnumKeyList.indexOf(statut)]);
          }

          // If statut is not selected
          else {
            
            // Add all possibilities
            this.optionListStatutElectronicKey.push(statutEnumList[statutEnumKeyList.indexOf(statut)]);
          }

        }

      } // If statut isn't saved
      else {

        // Add select a category if list is empty
        this.optionListStatutElectronicKey.push(this.selectACategory);

        // Loop list enum statut
        for(let st of statutEnumList) {

          // Add all possibilities
          this.optionListStatutElectronicKey.push(st);
          
        }

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

      let arrivalToUpdated = this.arrivalUpdateService.checkInformationRightsFirstSection(
        this.updateFirstSectionRightsForm.value, this.arrival, this.selectACategory
      );

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
      this.arrivalService.updateRightFirstSection(arrivalToUpdated).subscribe({
        
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
          console.log("Error update Rights First Section : "+ JSON.stringify(err));

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
