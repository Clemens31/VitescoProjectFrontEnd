import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { AccountStatusEnum } from 'src/app/enum/AccountStatusEnum';
import { ElectronicKeyEnum } from 'src/app/enum/ElectronicKeyEnum';
import { RecordingHoursEnum } from 'src/app/enum/RecordingHoursEnum';
import { RightsEnum } from 'src/app/enum/RightsEnum';
import { TcAccessEnum } from 'src/app/enum/TcAccessEnum';
import { YesOrNotEnum } from 'src/app/enum/YesOrNotEnum';
import { Arrival } from 'src/app/models/arrival';
import { Platform } from 'src/app/models/platform';
import { Right } from 'src/app/models/right';
import { ArrivalService } from 'src/app/service/arrival.service';
import { PlatformService } from 'src/app/service/platform.service';
import { Constants } from 'src/app/utils/constants';
import { ArrivalUpdateService } from '../../arrival-update-service';

@Component({
  selector: 'app-update-right',
  templateUrl: './update-right.component.html',
  styleUrls: ['./update-right.component.css']
})
export class UpdateRightComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Data   */
  /* **********************************  */

  @Input()
  arrival: Arrival;

  /* **********************************  */
  /* Functional Intelligence   */
  /* **********************************  */
  selectACategory: string;

  /* **********************************  */
  /* Build Form   */
  /* **********************************  */

  /** FormGroup */
  updateRightsForm: FormGroup;

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


  
  optionVpn: Array<any> = [];
  optionListAccountStatus: Array<any> = [];
  optionListTcAccess: Array<any> = [];
  optionListPlatform: Array<Platform> = [];
  optionListHil : Array<YesOrNotEnum> = [];
  optionListRecordingHours: Array<any> = [];
  optionElectronicKey: Array<any> = [];
  
  ims: Right;
  add: Right;
  limas: Right;

  // VPN
  isExternal: boolean = false;
  isStageLess3Months: boolean = false;

  constructor(
    private translate : TranslateService,
    private formBuilder: FormBuilder,
    private platformService: PlatformService,
    private spinner: NgxSpinnerService,
    public arrivalUpdateService: ArrivalUpdateService,
    private arrivalService: ArrivalService) { 
      super() }

  ngOnInit(): void {

    /** Display loader */
    this.spinner.show();

    /** Init Form */
    this.initRightForm();

    /** Init all Fields */
    this.initAllFields();

    /** Hide loader */
    this.spinner.hide();
  }

  /** Init Form */
  initRightForm() {
    this.updateRightsForm = this.formBuilder.group({
      vpn: new FormControl(this.arrival.vpn && this.arrival.vpn.vpn ? 
        this.arrival.vpn.vpn :
        null, []),
      idVpn: new FormControl(this.arrival.vpn && this.arrival.vpn.identifiantVpn ? 
        this.arrival.vpn.identifiantVpn : 
        null, []),
      accountStatus: new FormControl(null, []),
      tcAccess: new FormControl("", []),
      platform: new FormControl(this.arrival.platform.name, []),
      hil: new FormControl("", []),
      recordingHours: new FormControl("", []),
      electronicKey: new FormControl(null, []),
      location: new FormControl(
        this.arrival.electronicKey && this.arrival.electronicKey.location ? 
        this.arrival.electronicKey.location :
        null, []),
        ims: new FormControl("", []),
        add: new FormControl("", []),
        limas: new FormControl("", [])
    });
  }

  /** Init All Fields */
  initAllFields() {

    /** Get the value SelectACategory before the other actions FOR ALL SELECT */
    this.translate.get("arrival.createEmployee.selectACategory").subscribe((data: any) => {
      this.selectACategory = data;

      /* Detect if we can update the vpn */
      // Externe
      if(this.arrival && this.arrival.typeOfContract.name.toLowerCase() == Constants.EXTERNE.toLowerCase()) {
        this.isExternal = true;
      } else {
        this.isExternal = false;
      }
      // Less 3 months
      if(this.arrival && this.arrival.typeOfContract.name.toLowerCase() == Constants.STAGE_MOINS_3_MOIS.toLowerCase()) {
        this.isStageLess3Months = true;
      } else {
        this.isStageLess3Months = false;
      }



      /** Init Field VPN */
      this.initFieldVpn();

      /** Init Field Account status */
      this.initFieldAccountStatus();

      /** Init Field Tc Access */
      this.initFieldTcAccess();

      /** Init Field Platform */
      this.initFieldPlatform();

      /** Init Field Hil */
      this.initFieldHil();

      /** Init Field Recording Hours */
      this.initFieldRecordingHours();

      /** Init Field ElectronicKey */
      this.initFieldElectronicKey();

      /** InitFieldRights */
      this.initFieldRights();

    
    });
  }

  /** Init Field Vpn */
  initFieldVpn() {

    // Add VPN selected
    if(this.arrival.vpn && this.arrival.vpn.vpn) {
      this.optionVpn.push(this.arrival.vpn.vpn);
    } else {
      this.optionVpn.push(this.selectACategory);
    }

    // Add list of Enum
    const YesOrNotEnumList = Object.values(YesOrNotEnum);

    for(let yesOrNotEnum of YesOrNotEnumList) {

      // Add yes or no 
      if(this.arrival.vpn && this.arrival.vpn.vpn && 
        this.arrival.vpn.vpn.toLowerCase() == yesOrNotEnum.toLowerCase()) {
        // Nothing
      } else {
        this.optionVpn.push(yesOrNotEnum);
      }
    }

  }

  /** Init Field Account status */
  initFieldAccountStatus() {
    
    // Add list of Enum
    const accountStatusKeyList = Object.keys(AccountStatusEnum);
    const accountStatusList = Object.values(AccountStatusEnum);

    // Init first choice - Add select a category if object don't exists
    if(!this.arrival.accountStatus || !this.arrival.accountStatus.accountStatus) {
      this.optionListAccountStatus.push(this.selectACategory);

    // Add Account Status selected if object exists
    } else {
      for(let accountStatus of accountStatusKeyList) {
        if(this.arrival.accountStatus && 
          this.arrival.accountStatus.accountStatus.toLowerCase() == accountStatus.toLowerCase()) {
            this.optionListAccountStatus.push(accountStatusList[accountStatusKeyList.indexOf(accountStatus)]);
        }
      }
    }
    
    // Loop list enum
    for(let accountStatus of accountStatusList) {

      if(this.arrival.accountStatus && 
        this.optionListAccountStatus[0].toLowerCase() != accountStatus.toLowerCase()) {
        this.optionListAccountStatus.push(accountStatus);

        // Value already saved, nothing is added
      } else if(
        this.arrival.accountStatus && 
        this.optionListAccountStatus[0].toLowerCase() == accountStatus.toLowerCase()) {
      
        // If accountStatus doesn't exist
      } else {
        this.optionListAccountStatus.push(accountStatus);
      }
    }
  
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
          this.optionListTcAccess.push(tcAccessList[tcAccessKeyList.indexOf(tcAccess)]);
      }
    } 

    // Loop list enum
    for(let tcAccess of tcAccessList) {

      if(this.optionListTcAccess[0].toUpperCase() != tcAccess.toUpperCase()) {
        this.optionListTcAccess.push(tcAccess);
      }

    }

  }

  /** Init Field Platform */
  initFieldPlatform() {

    // Add plateform selected
    this.optionListPlatform.push(this.arrival.platform);

    // Get list Platforms from database
    this.platformService.getAllPlatforms().subscribe(
      (response: Platform[]) => {
        response.forEach((element: Platform) => {
          if(element.name != this.arrival.platform.name) {
            this.optionListPlatform.push(element);
          }
        });
      },
      (error: HttpErrorResponse) => {
        this.errorField + error.error;
      }
    );
  }

  /** Init Field Hil */
  initFieldHil() {

    // Add hil selected if exists
    this.optionListHil.push(this.arrival.hil.hil);

    // Add list of Enum
    const hilList = Object.values(YesOrNotEnum);
    
    // Loop list Enum
    for(let hil of hilList) {

      if(this.arrival.hil.hil.toUpperCase() != hil.toUpperCase()) {
        this.optionListHil.push(hil);
      }
    }

  }

  /** Init Field Recording Hours */
  initFieldRecordingHours() {

    // Add recording hours selected if exists
    if(this.arrival.recordingHours) {
      this.optionListRecordingHours.push(this.arrival.recordingHours);
    } else {
      this.optionListRecordingHours.push(this.selectACategory);
    }

    // Add list of Enum
    const recordingHoursKeyList = Object.keys(RecordingHoursEnum);
    const recordingHoursList = Object.values(RecordingHoursEnum);

    // Loop list Enum
    for(let recordingHoursKey of recordingHoursKeyList) {
      
      if(this.arrival.recordingHours && 
        this.arrival.recordingHours.toLowerCase() != recordingHoursKey.toLowerCase()) {
          this.optionListRecordingHours.push(
            recordingHoursList[recordingHoursKeyList.indexOf(recordingHoursKey)]);

      // Recording Hours exists and value equals 
      } else if(this.arrival.recordingHours && 
        this.arrival.recordingHours.toLowerCase() == recordingHoursKey.toLowerCase()) {

      } // Recording Hours doesn't exists
      else {
        this.optionListRecordingHours.push(
          recordingHoursList[recordingHoursKeyList.indexOf(recordingHoursKey)]);
      }
    }

  }

  /** Init Field ElectronicKey */
  initFieldElectronicKey() {

    // Add list of Enum
    const electronicKeyList = Object.keys(ElectronicKeyEnum);
    const electronicKeyValuesList = Object.values(ElectronicKeyEnum);

    // If electronickey exists
    if(this.arrival.electronicKey && this.arrival.electronicKey.electronicKeyEnum) {

      // Add value selected
      for(let ek of electronicKeyList) {
        if(this.arrival.electronicKey.electronicKeyEnum.toLowerCase() == ek.toLowerCase()) {
          this.optionElectronicKey.push(electronicKeyValuesList[electronicKeyList.indexOf(ek)]);
        } 
      }

      // Add other possibility
      for(let ek of electronicKeyValuesList) {
        if(this.optionElectronicKey[0].toLowerCase() != ek.toLowerCase()) {
          this.optionElectronicKey.push(ek);
        }
      }

      // If electronic key doesn't exists
    } else {
      // Add lign empty because not electronic key selected
        this.optionElectronicKey.push(this.selectACategory);

        // Add the all posibilities
        for(let ek of electronicKeyValuesList) {
          this.optionElectronicKey.push(ek);
        }
    }

  }

  /* Init Field Rights */
  initFieldRights() {

    // If arrival exists 
    if(this.arrival.rightList) {

      // Loop list rights
      for(let right of this.arrival.rightList) {
        
        // IMS
        if(right.name.toLowerCase() == "ims") {
          this.ims = right;
        }
        // Add
        if(right.name.toLowerCase() == "add") {
          this.add = right;
        }
        // Limas
        if(right.name.toLowerCase() == "limas") {
          this.limas = right;
        }

      }
    }
  }

  /* Update the checbkox statut */
  updateAttribute(name : string): void {

    // Loop list Rights already saved
    for(let right of this.arrival.rightList) {

      // If rights exists
      if(right.name && right.name.toLowerCase() == name.toLowerCase()) {
        right.isSelected = !right.isSelected;
      }
    }

    // If rights doesn't exist
    if(!this.arrival.rightList.find(r => 
      r.name.toLowerCase() == name.toLowerCase())) {

      // Get List all enum
      const rightKeyList = Object.keys(RightsEnum);

      // ADD 
      if(name.toLowerCase() == rightKeyList[0].toLowerCase()) {
        this.arrival.rightList.push(this.createRight(rightKeyList[0]));
      }

      // LIMAS 
      if(name.toLowerCase() == rightKeyList[1].toLowerCase()) {
        this.arrival.rightList.push(this.createRight(rightKeyList[1]));
      }

      // IMS 
      if(name.toLowerCase() == rightKeyList[2].toLowerCase()) {
        this.arrival.rightList.push(this.createRight(rightKeyList[2]));
      }

    }

    console.log("List final : " + JSON.stringify(this.arrival.rightList));
  }

  /** Create new Right */
  createRight(rightSelected?: any) {
    let right = new Right(null!, rightSelected!, true);
    return right;
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

      let arrivalToUpdated = this.arrivalUpdateService.checkInformationsRights(
        this.updateRightsForm.value, this.arrival, this.selectACategory,
        this.optionListPlatform);

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
      this.arrivalService.updateRight(arrivalToUpdated).subscribe({
        
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
          console.log("Error update Rights : "+ JSON.stringify(err));

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
