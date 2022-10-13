
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { AccountStatusEnum } from 'src/app/enum/AccountStatusEnum';
import { ElectronicKeyEnum } from 'src/app/enum/ElectronicKeyEnum';
import { RecordingHoursEnum } from 'src/app/enum/RecordingHoursEnum';
import { RightsEnum } from 'src/app/enum/RightsEnum';
import { StatutEnum } from 'src/app/enum/StatutEnum';
import { TcAccessEnum } from 'src/app/enum/TcAccessEnum';
import { YesNoIdkEnum } from 'src/app/enum/YesNoIdkEnum';
import { YesOrNotEnum } from 'src/app/enum/YesOrNotEnum';
import { AuthService } from 'src/app/manager/authentification/auth.service';
import { Arrival } from 'src/app/models/arrival';
import { Constants } from 'src/app/utils/constants';

@Component({
  selector: 'app-id-card',
  templateUrl: './id-card.component.html',
  styleUrls: ['./id-card.component.css']
})
export class IdCardComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Design   */
  /* **********************************  */

  imgTitle : string = Constants.ICON_ACCOUNT;
  edit : string = Constants.ICON_EDIT_WHITE;

  /** Open the pop up for close an arrival */
  displayPopUpConfirmClose : boolean;

  /** Open the pop up for delete an arrival */
  displayPopUpConfirmDelete : boolean;


  /* **********************************  */
  /* Data   */
  /* **********************************  */
  @Input()
  arrival: Arrival;

  // Display value
  accessTC: string;
  statutAccessTC: string;
  recordingHours: string;
  electronicKey: string;
  statutElectronicKey: string;
  statutHil: string;
  accountStatut: string;
  vpn: string;
  statutVpn: string;


  statutPlatform: string;
  imsValue: string;
  statutIMS: string;

  addValue: string;
  statutAdd: string;
  numberTicketAdd: string;

  limasValue: string;
  statutLimas: string;
  numberTicketLimas: string;
  referenceLimas: string;
  
  // ngIf html
  externe =  Constants.EXTERNE.toLowerCase();
  stageLess3 =  Constants.STAGE_MOINS_3_MOIS.toLowerCase();
  stage3AndMore =  Constants.STAGE_3_MOIS_ET_PLUS.toLowerCase();
  alternant =  Constants.ALTERNANT.toLowerCase();
  cdi =  Constants.CDI.toLowerCase();
  cdd =  Constants.CDD.toLowerCase();
  expat =  Constants.EXPAT.toLowerCase();

  // Arrival
  firstAccount: string;

  // Equipment Attributed
  yes: boolean;
  no: boolean;

  // Right
  ims= RightsEnum.IMS.toLowerCase();
  add= RightsEnum.ADD.toLowerCase();
  limas = RightsEnum.LIMAS.toLowerCase();

  /* **********************************  */
  /* Output   */
  /* **********************************  */

  /** Employee Output */
  @Output()
  sendUpdateEmployeeToParent = new EventEmitter();

  /** Arrival Output */
  @Output()
  sendUpdateArrivalToParent = new EventEmitter();

  /** Order Output */
  @Output()
  sendUpdateOrderToParent = new EventEmitter();

  /** Equipment Output */
  @Output()
  sendUpdateEquipmentToParent = new EventEmitter();

  /** School or Company output */
  @Output()
  sendUpdateSchoolOrCompanyToParent = new EventEmitter();

  /** Rights Output */
  @Output()
  sendUpdateRightsToParent = new EventEmitter();

  /** First Section Rights Output */
  @Output()
  sendUpdateFirstSectionRightsToParent = new EventEmitter();

  /** Second Section Rights Output */
  @Output()
  sendUpdateSecondSectionRightsToParent = new EventEmitter();

  /** Third Section Rights Output */
  @Output()
  sendUpdateThirdSectionRightsToParent = new EventEmitter();

  /** Fourth Section Rights Output */
  @Output()
  sendUpdateFourthSectionRightsToParent = new EventEmitter();

  /** Comment Output */
  @Output()
  sendUpdateCommentToParent = new EventEmitter();

  constructor(private translate : TranslateService,
    private authService: AuthService,
    private spinner: NgxSpinnerService) {
      super();
     }

  ngOnInit(): void {

    this.spinner.show();

    /** Get the value for Add yes/no */
    this.translate.get("arrival.inProgress.upateEquipment.yes").subscribe((data: any) => {
      this.yes = data;
    });
    this.translate.get("arrival.inProgress.upateEquipment.no").subscribe((data: any) => {
      this.no = data;
    });  

  }

  // After input load
  ngOnChanges() {

    /** Init all fields */
    this.initFields();
    
    this.spinner.hide();
  }

  /** Init all fields */
  initFields() {

    // Init Field FirstAccount
    this.initFieldFirstAccount();

    // Init Field tcAccess
    this.initFieldTcAccess();

    // Init Field Recording Hours
    this.initFieldRecordingHours();

    // Init Field Electronickey
    this.initFieldKeyElectronic();

    // Init Field Statut Hil
    this.initFieldStatutHil();

    // Init Field Statut Account
    this.initFieldStatutAccount();

    // Init Field VPN
    this.initFieldVPN();

    // Init Field Platform
    this.initFieldPlatform();

    // Init Field IMS
    this.initFieldIMS();

    // Init Field ADD
    this.initFieldADD();

    // Init Field LIMAS
    this.initFieldLIMAS();

  }

  /** Init Field FirstAccount */
  initFieldFirstAccount() {

    if(this.arrival) {

      // Add list of Enum
      const YesNoIdkEnumKeysList = Object.keys(YesNoIdkEnum);
      const YesNoIdkEnumList = Object.values(YesNoIdkEnum);

      // Add tcAccess selected if object exists
      for(let YesNoIdkEnum of YesNoIdkEnumKeysList) {
        if(this.arrival.firstAccount && 
          this.arrival.firstAccount.toLowerCase() == YesNoIdkEnum.toLowerCase()) {
            this.firstAccount = YesNoIdkEnumList[YesNoIdkEnumKeysList.indexOf(YesNoIdkEnum)];
        }
      } 
  
    }

  }

  /** Init Field TcAccess */
  initFieldTcAccess() {

    if(this.arrival) {

      // Add list of Enum
      const tcAccessKeyList = Object.keys(TcAccessEnum);
      const tcAccessList = Object.values(TcAccessEnum);

      // Add tcAccess selected if object exists
      for(let tcAccess of tcAccessKeyList) {
        if(this.arrival.tcAccess && 
          this.arrival.tcAccess.tcAccess.toLowerCase() == tcAccess.toLowerCase()) {
            this.accessTC = tcAccessList[tcAccessKeyList.indexOf(tcAccess)];
        }
      } 

      /** Statut Access */

      // Add list of Enum
      const statutKeysEnum = Object.keys(StatutEnum);
      const statutEnum = Object.values(StatutEnum);

      // Add statut selected if object exists
      for(let tcAccess of statutKeysEnum) {
        if(this.arrival.tcAccess.statut && 
          this.arrival.tcAccess.statut.toLowerCase() == tcAccess.toLowerCase()) {
            this.statutAccessTC = statutEnum[statutKeysEnum.indexOf(tcAccess)];
        }
      }  
    }

  }

  /** Init Field Recording Hours */
  initFieldRecordingHours() {

    if(this.arrival) {

      // Add list of Enum
      const recordingHoursKeysEnum = Object.keys(RecordingHoursEnum);
      const recordingHoursEnum = Object.values(RecordingHoursEnum);

      // Add recording hours selected if object exists
      for(let recording of recordingHoursKeysEnum) {
        if(this.arrival.recordingHours && 
          this.arrival.recordingHours.toLowerCase() == recording.toLowerCase()) {
            this.recordingHours = recordingHoursEnum[recordingHoursKeysEnum.indexOf(recording)];
        }
      } 
    }

  }

  /** Init Field key electronic */
  initFieldKeyElectronic() {

    if(this.arrival) {

      // Add list of Enum
      const electronicKeyKeysEnum = Object.keys(ElectronicKeyEnum);
      const electronicKeyEnum = Object.values(ElectronicKeyEnum);

      // Add electronic key selected if object exists
      for(let ek of electronicKeyKeysEnum) {
        if(this.arrival.electronicKey && this.arrival.electronicKey.electronicKeyEnum && 
          this.arrival.electronicKey.electronicKeyEnum.toLowerCase() == ek.toLowerCase()) {
            this.electronicKey = electronicKeyEnum[electronicKeyKeysEnum.indexOf(ek)];
        }
      } 

      /** Statut Electronickey */

      // Add list of Enum
      const statutKeysEnum = Object.keys(StatutEnum);
      const statutEnum = Object.values(StatutEnum);

      // Add statut selected if object exists
      for(let statut of statutKeysEnum) {
        if(this.arrival.electronicKey && this.arrival.electronicKey.statut &&
          this.arrival.electronicKey.statut.toLowerCase() == statut.toLowerCase()) {
            this.statutElectronicKey = statutEnum[statutKeysEnum.indexOf(statut)];
        }
      }  
    }

  }

  // Init Field Statut Hil
  initFieldStatutHil() {

    if(this.arrival) {

      // Add list of Enum
      const statutKeysEnum = Object.keys(StatutEnum);
      const statutEnum = Object.values(StatutEnum);

      // Add statut hil selected if object exists
      for(let statut of statutKeysEnum) {
        if(this.arrival.hil && this.arrival.hil.statut &&
          this.arrival.hil.statut.toLowerCase() == statut.toLowerCase()) {
            this.statutHil = statutEnum[statutKeysEnum.indexOf(statut)];
        }
      }  
    }

  }

  // Init Field Statut Account
  initFieldStatutAccount() {

    if(this.arrival) {

      // Add list of Enum
      const accountStatusKeysEnum = Object.keys(AccountStatusEnum);
      const accountStatusEnum = Object.values(AccountStatusEnum);

      // Add account statut selected if object exists
      for(let accountStatus of accountStatusKeysEnum) {
        if(this.arrival.accountStatus && this.arrival.accountStatus.accountStatus &&
          this.arrival.accountStatus.accountStatus.toLowerCase() == accountStatus.toLowerCase()) {
            this.accountStatut = accountStatusEnum[accountStatusKeysEnum.indexOf(accountStatus)];
        }
      }  
    }

  }

  // Init Field VPN
  initFieldVPN() {

    if(this.arrival) {

      // Add list of Enum
      const yesOrNotKeysEnum = Object.keys(YesOrNotEnum);
      const yesOrNotEnum = Object.values(YesOrNotEnum);

      // Add VPN selected if object exists
      for(let yesOrNot of yesOrNotKeysEnum) {
        if(this.arrival.vpn && this.arrival.vpn.vpn &&
          this.arrival.vpn.vpn.toLowerCase() == yesOrNot.toLowerCase()) {
            this.vpn = yesOrNotEnum[yesOrNotKeysEnum.indexOf(yesOrNot)];
        }
      } 

      /** Statut Access */

      // Add list of Enum
      const statutKeysEnum = Object.keys(StatutEnum);
      const statutEnum = Object.values(StatutEnum);

      // Add statut selected if object exists
      for(let statut of statutKeysEnum) {
        if(this.arrival.vpn && this.arrival.vpn.statut &&
          this.arrival.vpn.statut.toLowerCase() == statut.toLowerCase()) {
            this.statutVpn = statutEnum[statutKeysEnum.indexOf(statut)];
        }
      }  
    }

  }

  // Init Field Platform
  initFieldPlatform() {

    if(this.arrival) {

      // Add list of Enum
      const statutKeysEnum = Object.keys(StatutEnum);
      const statutEnum = Object.values(StatutEnum);

      // Add Platform statut selected if object exists
      for(let statut of statutKeysEnum) {
        if(this.arrival.platform && this.arrival.platform.statut &&
          this.arrival.platform.statut.toLowerCase() == statut.toLowerCase()) {
            this.statutPlatform = statutEnum[statutKeysEnum.indexOf(statut)];
        }
      }  
    }

  }

  // Init Field IMS
  initFieldIMS() {

    if(this.arrival) {

      // Add list of Enum
      const statutKeysEnum = Object.keys(StatutEnum);
      const statutEnum = Object.values(StatutEnum);

      this.translate.get("idCard.rights.fourthSection.yes").subscribe((yes: any) => {
        this.translate.get("idCard.rights.fourthSection.no").subscribe((no: any) => {

          // Add IMS selected if object exists
          if(this.arrival.rightList && this.arrival.rightList.length > 0) {
            for(let right of this.arrival.rightList) {

              if(right.name.toLowerCase() == RightsEnum.IMS.toLowerCase()
                && right.isSelected) {
                this.imsValue = yes;
                this.statutIMS = statutEnum[statutKeysEnum.indexOf(right.statut)];
                break;
              }
              this.imsValue = no;
            }
          }  // No rights
          else {
            this.imsValue = no;
          }

        });
      });

    }
  }

  // Init Field ADD
  initFieldADD() 
  
    {if(this.arrival) {

      // Add list of Enum
      const statutKeysEnum = Object.keys(StatutEnum);
      const statutEnum = Object.values(StatutEnum);

      this.translate.get("idCard.rights.fourthSection.yes").subscribe((yes: any) => {
        this.translate.get("idCard.rights.fourthSection.no").subscribe((no: any) => {

          // Add IMS selected if object exists
          if(this.arrival.rightList && this.arrival.rightList.length > 0) {
            for(let right of this.arrival.rightList) {

              if(right.name.toLowerCase() == RightsEnum.ADD.toLowerCase()
                && right.isSelected) {
                this.addValue = yes;
                this.statutAdd = statutEnum[statutKeysEnum.indexOf(right.statut)];
                this.numberTicketAdd = right.numberTicket;
                break;
              }
              this.addValue = no;
            }
          }  // No rights
          else {
            this.addValue = no;
          }

        });
      });

    }

  }

  // Init Field LIMAS
  initFieldLIMAS() {

    if(this.arrival) {

      // Add list of Enum
      const statutKeysEnum = Object.keys(StatutEnum);
      const statutEnum = Object.values(StatutEnum);
  
      this.translate.get("idCard.rights.fourthSection.yes").subscribe((yes: any) => {
        this.translate.get("idCard.rights.fourthSection.no").subscribe((no: any) => {
  
          // Add IMS selected if object exists
          if(this.arrival.rightList && this.arrival.rightList.length > 0) {
            for(let right of this.arrival.rightList) {
  
              if(right.name.toLowerCase() == RightsEnum.LIMAS.toLowerCase()
                && right.isSelected) {
                this.limasValue = yes;
                this.statutLimas = statutEnum[statutKeysEnum.indexOf(right.statut)];
                this.numberTicketLimas = right.numberTicket;
                this.referenceLimas = right.referenceUser;
                break;
              }
              this.limasValue = no;
            }
          }  // No rights
          else {
            this.limasValue = no;
          }
  
        });
      });
  
    }

  }

  /*********************************************************** */
  /** Open the fields */
  /*********************************************************** */

  /** Open the Update Employee section */
  openUpdateEmployee() {
    this.sendUpdateEmployeeToParent.emit("Open Field Employee");
  }

  /** Open the Update Arrival section */
  openUpdateArrival() {
    this.sendUpdateArrivalToParent.emit("Open Field Arrival");
  }

  /** Open the Update Order section */
  openUpdateOrder() {
    this.sendUpdateOrderToParent.emit("Open Field Order");
  }

  /** Open the Update Equipment section */
  openUpdateEquipment() {
    this.sendUpdateEquipmentToParent.emit("Open Field Equipment");
  }

  /** Open the Update School or Company section */
  openUpdateSchoolOrCompany() {
    this.sendUpdateSchoolOrCompanyToParent.emit("Open Field School and Company");
  }

  /** Open the Update Rights section */
  openUpdateRights() {
    this.sendUpdateRightsToParent.emit("Open Field Rights");
  }

  /** Open the Update comment section */
  openUpdateComment() {
    this.sendUpdateCommentToParent.emit("Open Field Comment");
  }

  /** Open the Update First Section Rights section */
  openFirstSectionRight() {
    this.sendUpdateFirstSectionRightsToParent.emit("Open Field First Section");
  }

  /** Open the Update Second Section Rights section */
  openSecondSectionRight() {
    this.sendUpdateSecondSectionRightsToParent.emit("Open Field Second Section");
  }

  /** Open the Update Third Section Rights section */
  openThirdSectionRight() {
    this.sendUpdateThirdSectionRightsToParent.emit("Open Field Third Section");
  }

  /** Open the Update Fourth Section Rights section */
  openfourthSectionRight() {
    this.sendUpdateFourthSectionRightsToParent.emit("Open Field Fourth Section");
  }


  /*********************************************************** */
  /** Buttons Delete and close Arrival */
  /*********************************************************** */
  onCloseArrival() {
    this.openPopupCloseArrival();
  }

  onDeleteArrival() {
    this.openPopUpDeleteArrival();
  }

  /*********************************************/
  /* Open Pop up */
  /*********************************************/
  openPopupCloseArrival() {
    // Open pop up close
    this.displayPopUpConfirmClose = true;
  }

  openPopUpDeleteArrival() {
    // Open pop up cancel
    this.displayPopUpConfirmDelete = true;
  }

  /*********************************************/
  /* Close Pop up */
  /*********************************************/

  /** Close the Pop Up when the cross is pressed */
  closePopupCloseAndDelete() {

    // Undisplay the pop up
    this.displayPopUpConfirmClose = false;
    this.displayPopUpConfirmDelete = false;
  }


  /*********************************************************** */
  /** Role */
  /*********************************************************** */
  get isAdmin(): boolean {
    return this.authService.isManagerAdmin(this.authService.currentManager);
  }

}
