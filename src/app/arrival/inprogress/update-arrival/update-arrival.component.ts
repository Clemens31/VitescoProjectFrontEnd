import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { YesNoIdkEnum } from 'src/app/enum/YesNoIdkEnum';
import { Arrival } from 'src/app/models/arrival';
import { PlaceOfActivity } from 'src/app/models/placeOfActivity';
import { TypeOfContract } from 'src/app/models/typeOfContract';
import { ArrivalService } from 'src/app/service/arrival.service';
import { PlaceOfActivityService } from 'src/app/service/place-of-activity.service';
import { TypeOfContractService } from 'src/app/service/type-of-contract.service';
import { Constants } from 'src/app/utils/constants';
import { Methods } from 'src/app/utils/methods';
import { ArrivalUpdateService } from '../../arrival-update-service';

@Component({
  selector: 'app-update-arrival',
  templateUrl: './update-arrival.component.html',
  styleUrls: ['./update-arrival.component.css']
})
export class UpdateArrivalComponent extends AbstractSubscription implements OnInit {

  /** Open the pop up for update an arrival */
  displayPopUpConfirm : boolean;
  
 /* **********************************  */
  /* Data   */
  /* **********************************  */

  @Input()
  arrival: Arrival;

  /* **********************************  */
  /* Build Form   */
  /* **********************************  */

  /** FormGroup */
  updateArrivalForm: FormGroup;


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


  /* **********************************  */
  /* Functional Intelligence   */
  /* **********************************  */
  selectACategory: string;

  /** Select option Translate TS Place of activity */
  placeOfActivities : Array<PlaceOfActivity> = [];
  typesOfContracts : Array<TypeOfContract> = [];
  optionFieldFirstAccount: Array<any> = [];

  /** Open the field office adress when the place of activity is "Site" */
  openFieldOfficeAdress: boolean;

  /** Open the field OBMS and VTOS when the type of contract change */
  opensFieldsWhenExternalIsSelected : boolean;
  externalSelection: string;

  constructor(
    private translate : TranslateService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private placeOfActivityService : PlaceOfActivityService,
    private typeOfContractService: TypeOfContractService,
    public arrivalUpdateService: ArrivalUpdateService,
    private arrivalService: ArrivalService) { 
      super()
    }

  ngOnInit(): void {
    
    /** Display loader */
    this.spinner.show();

    /** Init Form */
    this.initUpdateArrivalForm();

    /** Init all Fields */
    this.initFields();

    /** Hide loader */
    this.spinner.hide();
     
  }

  /** Init Arrival */
  initUpdateArrivalForm() {
    this.updateArrivalForm = this.formBuilder.group({
      dateOfEntry: new FormControl("", [Validators.required]),
      releaseDate: new FormControl("", []),
      placeOfActivity: new FormControl(Methods.transformUpperCaseToTitleCase(this.arrival.placeOfActivity.name), [Validators.required]),
      typeOfContract: new FormControl(Methods.transformUpperCaseToTitleCase(this.arrival.typeOfContract.name), [Validators.required]),
      obms: new FormControl(this.arrival.obms ? 
        Methods.transformUpperCaseToTitleCase(this.arrival.obms) : 
        null, []),
      vtos: new FormControl(this.arrival.vtos, []),
      responsible: new FormControl(Methods.transformUpperCaseToTitleCase(this.arrival.vtResponsible), [Validators.required]),
      costCenter: new FormControl(Methods.transformUpperCaseToTitleCase(this.arrival.costCenter), [Validators.required]),
      firstAccount: new FormControl(this.arrival.firstAccount, [Validators.required]),
      officeAdress: new FormControl(this.arrival.officeAdress ? 
        Methods.transformUpperCaseToTitleCase(this.arrival.officeAdress) :
        null, []),
      
      //releaseDate: new FormControl(this.datePipe.transform(this.arrival.releaseDate,'MMMM d, y'), []),
    });
  }

  /** Init all fields */
  initFields() {

    /** Get the value SelectACategory before the other actions FOR ALL SELECT */
    this.translate.get("arrival.createEmployee.selectACategory").subscribe((data: any) => {
      this.selectACategory = data;

      /** Place of activity */
      this.initFieldPlaceOfActivity();

      /** Type of contract */
      this.initFieldTypeOfContract();

      /** First Account */
      this.initFieldFirstAccount();

    });

  }

  /** Init Field Place of Activity */
  initFieldPlaceOfActivity() {

    // Add the field selected
    this.placeOfActivities.push(new PlaceOfActivity(this.arrival.placeOfActivity.name, this.arrival.placeOfActivity.id_placeOfActivity));

    // Init Field for display or not the field Office Adress
    if(this.arrival.placeOfActivity.name.toLowerCase() == Constants.SUR_SITE.toLowerCase()) {
      this.openFieldOfficeAdress = true;
    } else {
      this.openFieldOfficeAdress = false;
    }

    // Get list Place of Activity from database
    this.placeOfActivityService.getAllPlaceOfActivity().subscribe(
      (response: PlaceOfActivity[]) => {
        response.forEach((element: PlaceOfActivity) => {

          /* Add all place of activity except the place activity selected */
          if(element.id_placeOfActivity != this.arrival.placeOfActivity.id_placeOfActivity) {
            this.placeOfActivities.push(new PlaceOfActivity(element.name, element.id_placeOfActivity));
          }

        });
      },
      (error: HttpErrorResponse) => {
        if(error.status == 403) {
          this.translate.get("globals.error.403").subscribe((data : any) => {
            alert(data);
          });
        }
      }
    );
  }

  /** Init Field Type of Contract */
  initFieldTypeOfContract() {

    // Add selectACategory
    this.typesOfContracts.push(new TypeOfContract(this.arrival.typeOfContract.name, this.arrival.typeOfContract.id_typeOfContract));

    // Init Field for display or not the field Office Adress
    if(this.arrival.typeOfContract.name.toLowerCase() == Constants.EXTERNE.toLowerCase()) {
      this.opensFieldsWhenExternalIsSelected = true;
    } else {
      this.opensFieldsWhenExternalIsSelected = false;
    }

    // Get list Place of Activity from database
    this.typeOfContractService.getAllTypeOfContract().subscribe(
      (response: TypeOfContract[]) => {
        response.forEach((element: TypeOfContract) => {

          /* Add all place of activity except the place activity selected */
          if(element.id_typeOfContract != this.arrival.typeOfContract.id_typeOfContract) {
            this.typesOfContracts.push(new TypeOfContract(element.name, element.id_typeOfContract));
          }

          // Add information to the variable
          switch(element.name.toLowerCase()) {

            case "externe":
              this.externalSelection = element.name; 
              break;

          }    
                
        });
      },
      (error: HttpErrorResponse) => {
        if(error.status == 403) {
          this.translate.get("globals.error.403").subscribe((data : any) => {
            alert(data);
          });
        }
      }
    );
  }

  /** Init Field First Account */
  initFieldFirstAccount() {

    // Add list of enum
    const yesOrNotEnumList = Object.keys(YesNoIdkEnum);
    const yesOrNotEnumValuesList = Object.values(YesNoIdkEnum);

    for(let yesOrNotEnum of yesOrNotEnumList) {

      if(this.arrival.firstAccount.toUpperCase() != yesOrNotEnum.toUpperCase()) {
        this.optionFieldFirstAccount.push(yesOrNotEnumValuesList[yesOrNotEnumList.indexOf(yesOrNotEnum)]);
      } else {
        // Add the first Account selected
        this.optionFieldFirstAccount.unshift(yesOrNotEnumValuesList[yesOrNotEnumList.indexOf(yesOrNotEnum)]);
      }
    }
    
  }


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

    // Call service for check informations
    try {
      let arrivalToUpdated = this.arrivalUpdateService.checkInformationsArrivalUpdate(
        this.updateArrivalForm.value, this.arrival, this.placeOfActivities, this.typesOfContracts,
        this.optionFieldFirstAccount);

        console.log("arrivalToUpdated : " + arrivalToUpdated);

        /* If everything is good */
        if(!this.errorField || this.errorField != null || this.errorField == "") {

          /** If no modification on the others components */
          if(this.arrivalUpdateService.additionalInformations.length == 0) {

            /** Call back end for update the new Arrival */ 
            this.updateArrival(arrivalToUpdated);

            /** Hide loader */
            this.spinner.hide();

            /** Open composant if need to confirm delete somes informations */
          } else {

            /** Display loader */
            this.spinner.hide();

            /* Call child */
            this.openPopupUpdateArrival();
          }

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
  /* Update Arrival after confirmation from child */
  /*********************************************/
  updateArrivalFromChild(arrivalToUpdated: Arrival) {
    this.updateArrival(arrivalToUpdated);
  }


  /*********************************************/
  /* Update Arrival */
  /*********************************************/
  /** Call back end for the update */
  updateArrival(arrivalToUpdated: Arrival) {

    /** Call back end for update the new Arrival */ 
    this.subscriptions.push(
      this.arrivalService.updateArrival(arrivalToUpdated).subscribe({
        
        next: (value: Arrival) => {
          
        console.log("Update successfull");
        this.recordingCompleted = Constants.UPDATE_COMPLETED;

        // Clean message error and additionalInformations
        this.errorField = "";
        this.arrivalUpdateService.additionalInformations = [];

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


  /* **********************************  */
  /* Interaction Management  */
  /* **********************************  */

  /** Display or not the field "office adress" when the field place of activity is "site" */
  onEditFieldOfficeAdress(item: any): void {

    // When the field "place of activity" is "Site". Display "office adress"
    if(item.target.value.includes(Constants.SUR_SITE)) {
      this.openFieldOfficeAdress = true;

      // When the field "place of activity" isn't "Site". Hidden "office adress"
    } else {
      this.openFieldOfficeAdress = false;
      // Clean the field school
      this.updateArrivalForm.controls['officeAdress'].setValue(null);
    }
    
  }

  /** Display or not the fields when the field Type of Contract change */
  onEditFieldTypeOfContract(item: any): void {

    /** When the type of contract is "External". */ 
    // Display N° OBMS, N° VTOS
    if(item.target.value.toLowerCase() == this.externalSelection){

      // All fields in relation with External opened
      this.opensFieldsWhenExternalIsSelected = true;

    } else {

      // Close all fields
      this.opensFieldsWhenExternalIsSelected = false;

      // Clean the field school
      this.updateArrivalForm.controls['obms'].setValue(null);
      this.updateArrivalForm.controls['vtos'].setValue(null);
    }
    
  }


  /*********************************************/
  /* Open Pop up */
  /*********************************************/

  openPopupUpdateArrival() {
    // Open pop up
    this.displayPopUpConfirm = true;
  }


  /*********************************************/
  /* Close Pop up */
  /*********************************************/

  /** Close the Pop Up when the cross is pressed */
  closePopupUpdateArrival() {

    // Delete the informations if changement
    this.arrivalUpdateService.additionalInformations = [];

    // Refresh Component
    this.refreshArrival();

    // Undisplay the pop up
    this.displayPopUpConfirm = false;
  }


}
