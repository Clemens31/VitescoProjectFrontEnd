import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { AccountStatusEnum } from 'src/app/enum/AccountStatusEnum';
import { ElectronicKeyEnum } from 'src/app/enum/ElectronicKeyEnum';
import { RecordingHoursEnum } from 'src/app/enum/RecordingHoursEnum';
import { TcAccessEnum } from 'src/app/enum/TcAccessEnum';
import { YesNoIdkEnum } from 'src/app/enum/YesNoIdkEnum';
import { YesOrNotEnum } from 'src/app/enum/YesOrNotEnum';
import { Arrival } from 'src/app/models/arrival';
import { Company } from 'src/app/models/company';
import { ComputerModel } from 'src/app/models/computerModel';
import { ComputerType } from 'src/app/models/computerType';
import { Equipment } from 'src/app/models/equipment';
import { PlaceOfActivity } from 'src/app/models/placeOfActivity';
import { Platform } from 'src/app/models/platform';
import { School } from 'src/app/models/school';
import { TypeOfContract } from 'src/app/models/typeOfContract';
import { ArrivalService } from 'src/app/service/arrival.service';
import { CompanyService } from 'src/app/service/company.service';
import { ComputerModelService } from 'src/app/service/computer-model.service';
import { ComputerTypeService } from 'src/app/service/computer-type.service';
import { EquipmentService } from 'src/app/service/equipment.service';
import { PlaceOfActivityService } from 'src/app/service/place-of-activity.service';
import { PlatformService } from 'src/app/service/platform.service';
import { SchoolService } from 'src/app/service/school.service';
import { TypeOfContractService } from 'src/app/service/type-of-contract.service';
import { Constants } from 'src/app/utils/constants';
import { ArrivalCreationService } from '../arrival-creation-service';

@Component({
  selector: 'app-creation-employee',
  templateUrl: './creation-employee.component.html',
  styleUrls: ['./creation-employee.component.css']
})
export class CreationEmployeeComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Design   */
  /* **********************************  */

  /** Icon for delete equipment */
  deletedIcon: string = Constants.ICON_DELETE;


  /* **********************************  */
  /* All fields to translate Text */
  /* **********************************  */

  /** Get name "Select a category" in TS */
  selectACategory: string;


  /** Select option Yes/No */
  optionFieldFirstAccount: Array<any> = [];

  /** Field List Equipment */
  optionListEquipment: Array<string> = [];

  /** Field List Computer Type */
  optionListComputerType: Array<ComputerType> = [];

  /** Field List Computer Power */
  optionListComputerModel: Array<ComputerModel> = [];

  /** Field List Computer Power */
  optionListPlatform: Array<Platform> = [];

  /** Field List Office 365 */
  optionListAccountStatus: Array<string> = [];

  /** Field List Yes/No */
  optionListYesNo : Array<string> = [];

  /** Field List TC Acces */
  optionListTcAccess: Array<string> = [];

  /** Field List Recording Hours */
  optionListRecordingHours: Array<string> = [];




  /* **********************************  */
  /* Functional Intelligence   */
  /* **********************************  */

  /** Select option Translate TS Place of activity */
  placeOfActivities : Array<PlaceOfActivity> = [];

  /** Open the field office adress when the place of activity is "Site" */
  openFieldOfficeAdress: boolean = false;

  /* **********************************  */ 


  /** Select option Translate TS Type Of Contract and external */ 
  typesOfContracts : Array<TypeOfContract> = [];

  /* Open fields : "obms", "vtos", "order", "startOfOrderPeriod", "endOfOrderPeriod", 
    "Company" and "VPN" when the field "Type of contract" is "external" */
  externalSelection: string;
  opensFieldsWhenExternalIsSelected : boolean = false;
  
  /* Open field : "School" when the Type of contract is : "Internship -3 months" or "Internship 3 months and more" or "Apprentice" */
  internshipOrApprenticeSelection: Array<string> = [];
  openFieldSchool: boolean = false;

  /* Open field : "VPN" when the Type of contract is : "Internship -3 months" */
  internshipLess3MonthsSelection: String ;
  openFieldVpn: boolean = false;

  /* **********************************  */


  /** Field list Company and list School */ 
  listCompany: Array<Company> = [];
  listSchool: Array<School> = [];
  company: string = "";
  school: string = "";

  /* **********************************  */


  /** Display the section for add a new equipment outside the init list */
  otherEquipment : string;
  /** Notifies the ngIf of the change when the contract type is External */
  openFieldOtherEquipment: boolean = false;

  /* **********************************  */


  /** Field List Electronic key */
  optionListElectronicKey: Array<string> = [];
  /** Select option Translate TS ElectronicKey */
  electronicKey : Array<string> = [];

  /** Open the field "ID Electronic key" when the field selected is Electronic key blue */
  openFieldIdElectronicKey: boolean = false;

  /************************************ */

  /** Open the field Reference User when the Rigths "limas" is selected */
  openFieldReferenceUser: boolean = false;


  /* **********************************  */
  /* Build Form   */
  /* **********************************  */

  /** FormGroup */
  createEmployeeForm: FormGroup;


  /* **********************************  */
  /* Build Form equipment  */
  /* **********************************  */

  /** FormGroup Equipment */
  equipmentForm: FormGroup;

  /** Init equipment list*/
  equipmentInitList: Array<Equipment> = [];
  
  /** Result equipment list */
  equipmentResultList: Array<string> = [];

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


  constructor(private translate : TranslateService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private placeOfActivityService : PlaceOfActivityService,
    private schoolService : SchoolService,
    private companyService : CompanyService,
    private typeOfContractService : TypeOfContractService,
    private platformService : PlatformService,
    private computerModelService : ComputerModelService,
    private computerTypeService : ComputerTypeService,
    private equipmentService : EquipmentService,
    private arrivalCreationService : ArrivalCreationService,
    private arrivalService : ArrivalService
    ) { super()}

  ngOnInit(): void {

    /** Display loader */
    this.spinner.show();

    /** Get text */
    this.getAllTextForTypeScript();

    /** Initialisation FormGroup */
    this.initCreationEmployeeForm();

    /** Initialisation FormGroup for Equipment */
    this.initFormEquipment();

    /** Hide loader */
    this.spinner.hide();

  }


  /*********************************************************** */
  /** Init all Text *** */
  /*********************************************************** */

  /** Method to obtain all the texts in TypeScript */
  getAllTextForTypeScript() {

    /** Get the value SelectACategory before the other actions FOR ALL SELECT */
    this.translate.get("arrival.createEmployee.selectACategory").subscribe((data: any) => {
      this.selectACategory = data;

      /** PlaceOfActivity */
      this.initFieldPlaceOfActivity();

      /** Type of contract */
      this.initFieldTypeOfContract();

      /** First Account */
      this.initFieldFirstAccount();

      /** initialization of the different options for list of Company field */
      this.initFieldListCompany();

      /** initialization of the different options for list of School field */
      this.initFieldListSchool();

      /** Initilisation list equipment in select option when the subscribe is over */
      this.initFieldEquipment();

      /** initialization of the different options for the ComputerType field */
      this.initFieldComputerType();

      /** initialization of the different options for the TypeOfMachine field */
      this.initFieldComputerModel();

      /** initialization of the different options for the Platform field */
      this.initFieldPlatform();

      /** initialization of the different options for the AccountStatus field */
      this.initFieldAccountStatus();

      /** initialization list Yes or No - Hil Access, VpnAccessRequest */
      this.initListYesOrNo();

      /** initialization of the different options for the ComputerPower field */
      this.initFieldTcAccess();

      /** initialization of the different options for the Recording Hours field */
      this.initFieldRecordingHours();

      /** initialization of the different options for the ComputerPower field */
      this.initFieldElectronicKey();

    });
  }

  /** Init Field Place of Activity */
  initFieldPlaceOfActivity() {

    // Add the field select a category
    this.placeOfActivities.push(new PlaceOfActivity(this.selectACategory));

    // Get list Place of Activity from database
    this.placeOfActivityService.getAllPlaceOfActivity().subscribe(
      (response: PlaceOfActivity[]) => {
        response.forEach((element: PlaceOfActivity) => {
          this.placeOfActivities.push(new PlaceOfActivity(element.name, element.id_placeOfActivity));
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
    this.typesOfContracts.push(new TypeOfContract(this.selectACategory));

    // Get list Place of Activity from database
    this.typeOfContractService.getAllTypeOfContract().subscribe(
      (response: TypeOfContract[]) => {
        response.forEach((element: TypeOfContract) => {
          this.typesOfContracts.push(new TypeOfContract(element.name, element.id_typeOfContract));

          switch(element.name.toLowerCase()) {

            case "externe":
              this.externalSelection = element.name; 
              break;

            case "stage -3 mois":
              this.internshipOrApprenticeSelection.push(element.name);
              this.internshipLess3MonthsSelection = element.name;
              break;

            case "stage 3 mois et plus":
              this.internshipOrApprenticeSelection.push(element.name);
              break;

            case "alternant": 
              this.internshipOrApprenticeSelection.push(element.name);
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

  /** Init option Yes or No */
  initFieldFirstAccount() {
    // Add selectACategory
    this.optionFieldFirstAccount.push(this.selectACategory);

    // Add list of Enum
    const YesOrNotEnumList = Object.values(YesNoIdkEnum);
    for(let yesOrNotEnum of YesOrNotEnumList) {
       this.optionFieldFirstAccount.push(yesOrNotEnum);
    }
  
  }

  /** Init Field List Company */
  initFieldListCompany() {
    this.listCompany.push(new Company(this.selectACategory));
    
    // Get list Company from database
    this.companyService.getAllCompagnies().subscribe(
      (response: any) => {
        response.forEach((element: Company) => {
          this.listCompany.push(new Company(element.name.toLowerCase(), element.id_company!, 
          element.expiry_date_prevention_plan!, element.archived!));
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

  /** Init Field List School */
  initFieldListSchool() {
    this.listSchool.push(new School(this.selectACategory));

    // Get list school from database
    this.schoolService.getAllSchools().subscribe(
      (response: any) => {
        response.forEach((element: School) => {
          this.listSchool.push(
            new School(element.name.toLowerCase(), element.id_school!, 
            element.expiry_date_prevention_plan!, element.archived!));
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

  /** Init Field Equipment */
  initFieldEquipment() {

    // Delete all elements in equipment list when reload list
    this.equipmentInitList = [];

    // Add select a category
    this.equipmentInitList.push(new Equipment(this.selectACategory, false));

    // Get list Equipment from database
    this.equipmentService.getAllEquipments().subscribe(
      (response: any) => {
        response.forEach((element: Equipment) => {
          this.equipmentInitList.push(new Equipment(
            element.name.toLowerCase(), false, element.id_equipment!, element.recovered!, element.archived! ));
        });

      /** Get name "Other Equipment" in TS */
      this.translate.get("arrival.createEmployee.equipment.otherEquipment").subscribe((data: any) => {
      this.otherEquipment = data;

      /** Initilisation list equipment in select option when the subscribe is over */
      this.equipmentInitList.push(new Equipment(this.otherEquipment, false));

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

  /** Init Field ComputerType */
  initFieldComputerType() {

    // Add selectACategory
    this.optionListComputerType.push(new ComputerType(this.selectACategory));

    // Get list ComputerType from database
    this.computerTypeService.getAllComputersType().subscribe(
      (response: any) => {
        response.forEach((element: ComputerType) => {
          this.optionListComputerType.push(new ComputerType(
            element.name.toLowerCase(), element.id_computerType));
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

  /** Init Field Type Of Machine */
  initFieldComputerModel() {

    // Add selectACategory
    this.optionListComputerModel.push(new ComputerModel(this.selectACategory));
    
    // Get list ComputerModel from database
    this.computerModelService.getAllComputerModels().subscribe(
      (response: any) => {
        response.forEach((element: ComputerModel) => {
          this.optionListComputerModel.push(new ComputerModel(
            element.name.toLowerCase(), element.id_computerModel));
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

  /** Init Field Platform */
  initFieldPlatform() {

    // Add selectACategory
    this.optionListPlatform.push(new Platform(this.selectACategory));

    // Get list Platforms from database
    this.platformService.getAllPlatforms().subscribe(
      (response: Platform[]) => {
        response.forEach((element: Platform) => {
          this.optionListPlatform.push(new Platform(element.name, element.id_platform)); 
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

  /** Init Field Office 365 */
  initFieldAccountStatus() {

    // Add selectACategory
    this.optionListAccountStatus.push(this.selectACategory);

    // Add list of Enum
    const accountStatusList = Object.values(AccountStatusEnum);
    for(let accountStatus of accountStatusList) {
       this.optionListAccountStatus.push(accountStatus);
    }

  }

  /** Init List Yes Or No */
  initListYesOrNo() {
    
    // Add selectACategory
    this.optionListYesNo.push(this.selectACategory);

    // Add list of Enum
    const YesOrNotEnumList = Object.values(YesOrNotEnum);
    for(let yesOrNotEnum of YesOrNotEnumList) {
       this.optionListYesNo.push(yesOrNotEnum);
    }
  }

  /** Init Field TcAccess */
  initFieldTcAccess() {

    // Add selectACategory
    this.optionListTcAccess.push(this.selectACategory);
  
    // Add list of Enum
    const tcAccessList = Object.values(TcAccessEnum);
    for(let tcAccess of tcAccessList) {
       this.optionListTcAccess.push(tcAccess);
    }
  
  }

  /** Init Field Recording Hours */
  initFieldRecordingHours() {
    this.optionListRecordingHours.push(this.selectACategory);

    // Add list of Enum
    const recordingHoursList = Object.values(RecordingHoursEnum);
    for(let recordingHours of recordingHoursList) {
       this.optionListRecordingHours.push(recordingHours);
    }
  }

  /** Init Field ElectronicKey */
  initFieldElectronicKey() {

    // Add selectACategory
    this.optionListElectronicKey.push(this.selectACategory);
    
    // Add list of Enum
    const electronicKeyList = Object.values(ElectronicKeyEnum);
    for(let electronicKey of electronicKeyList) {
       this.optionListElectronicKey.push(electronicKey);
    }

  }


  /* **********************************  */
  /** Initialisation form  */
  /* **********************************  */

  initCreationEmployeeForm() {
    this.createEmployeeForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null,[Validators.required]),
      dateOfEntry: new FormControl(null,[Validators.required]),
      releaseDate: new FormControl(null,[]),
      placeOfActivity: new FormControl(null,[Validators.required]),
      typeOfContract: new FormControl(null,[Validators.required]),
      obms: new FormControl(null,[]),
      vtos: new FormControl(null,[]),
      order: new FormControl(null,[]),
      startOfOrderPeriod: new FormControl(null,[]),
      endOfOrderPeriod: new FormControl(null,[]),
      responsible: new FormControl(null,[Validators.required]),
      costCenter: new FormControl(null,[Validators.required]),
      firstAccount: new FormControl(null,[Validators.required]),
      company: new FormControl(null,[]),
      school: new FormControl(null,[]),
      officeAdress: new FormControl(null,[]),
      comments: new FormControl(null,[]),
      computerType: new FormControl(null,[Validators.required]),
      computerModel: new FormControl(null,[Validators.required]),
      platform: new FormControl(null,[Validators.required]),
      accountStatus: new FormControl(null,[]),
      tcAccess: new FormControl(null,[Validators.required]),
      hil: new FormControl(null,[Validators.required]),
      recordingHours: new FormControl(null,[]),
      electronicKey: new FormControl(null,[]),
      location: new FormControl(null, []),
      vpn: new FormControl(null,[]),
      limas: new FormControl(null,[]),
      add: new FormControl(null,[]),
      ims: new FormControl(null,[]),
      referenceUser: new FormControl(null,[]),
    });
  }

  /** Initilisation form for equipment */
  initFormEquipment() {
    this.equipmentForm = this.formBuilder.group({
      equipment: new FormControl(null,[]),
      otherEquipment: new FormControl(null,[])
    });
  }


  /* **********************************  */
  /* Form Send new Employee */
  /* **********************************  */

  /** Event when submit button is pressed */
  onSubmitForm() {

    /** Display loader */
    this.spinner.show();

    // Re init the recording completed
    this.recordingCompleted ="";

    // Re init all errors
    this.errorField = "";

    try {
      let arrivalCreated = this.arrivalCreationService.checkInformations(
        this.createEmployeeForm.value, this.equipmentResultList, 
        this.equipmentInitList, this.optionListComputerModel, 
        this.optionListComputerType, this.placeOfActivities, this.typesOfContracts, 
        this.listSchool, this.listCompany, this.optionListPlatform, this.selectACategory);

        
    if(!this.errorField || this.errorField != null || this.errorField == "") {

      /** Call back end for save the new Arrival */ 
      this.subscriptions.push(
        this.arrivalService.creationArrival(arrivalCreated).subscribe({
  
          next: (value: Arrival) => {
            this.recordingCompleted = Constants.RECORDING_COMPLETED;

            // Reset form
            this.createEmployeeForm.reset();
            this.equipmentForm.reset();

            // Reload data if equipment is added in other equipment
            this.initFieldEquipment();

            // Re init all fields
            this.reinitAllFields()
          },
  
          error: (err: any) => {
            console.log("Creation Arrival - Error");
  
            // Delete the message sucessfull
            this.recordingCompleted == null;
  
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
          }
        })
      );
    }

    /** Hide loader */
    this.spinner.hide();

    } catch (e) {

    /* Subscribe erros */
    this.errorField = this.arrivalCreationService.errorField;
    console.log(this.errorField);

    /** Hide loader */
    this.spinner.hide();
    }

    /** Hide loader */
    this.spinner.hide();


  }

  /** When button is pressed, if element isn't null, empty or "Select a category", call the method for add the element in result */
  onSubmitEquipmentForm() {
    // Get the all value in control
    let equipment = this.equipmentForm.value["equipment"];
    let otherEquipmentValue = this.equipmentForm.value["otherEquipment"];

    // Add equipment in result
    if (equipment != null && equipment != "" && equipment != this.selectACategory && this.openFieldOtherEquipment === false) {
      this.onAddEquipment(equipment);
    }
    // Add equipment in result if other equipment
    if(otherEquipmentValue != null && otherEquipmentValue != "" && equipment.toLowerCase() === this.otherEquipment.toLowerCase()) {
      this.onAddEquipment(otherEquipmentValue);
    } 
  }

  /* **********************************  */
  /* Interaction Management  */
  /* **********************************  */

  /** Display or not the fields when the field Type of Contract change */
  onEditFieldTypeOfContract(item: any): void {

    /** When the type of contract is "External". */ 
    // Display N° OBMS, N° VTOS, N° Order, StartOfOrderPeriod, EndOfOrderPeriod, Company, VPN
    if(item.target.value.toLowerCase() == this.externalSelection){

      // All fields in relation with External opened
      this.opensFieldsWhenExternalIsSelected = true;
      // The VPN field is displayed
      this.openFieldVpn = true;

      // Close the others fields 
      this.openFieldSchool = false;

      // Clean the field school
      this.createEmployeeForm.controls['school'].setValue(null);

    } /**  When the type of contract is "Internship -3 months". */
     else if(item.target.value.toLowerCase() == this.internshipLess3MonthsSelection) {
      // The VPN field is displayed
      this.openFieldVpn = true;
      this.openFieldSchool = true;

      // Close the other field 
      this.opensFieldsWhenExternalIsSelected = false;

      // Clean the field school
      this.createEmployeeForm.controls['obms'].setValue(null);
      this.createEmployeeForm.controls['vtos'].setValue(null);
      this.createEmployeeForm.controls['order'].setValue(null);
      this.createEmployeeForm.controls['startOfOrderPeriod'].setValue(null);
      this.createEmployeeForm.controls['endOfOrderPeriod'].setValue(null);
      this.createEmployeeForm.controls['company'].setValue(null);

    }  /** When the type of contract is "Internship +3 months" or "apprentice" */ 
    else if(this.internshipOrApprenticeSelection.includes(item.target.value.toLowerCase())) {
      // The School field is displayed
      this.openFieldSchool = true;

      // Close the others fields
      this.opensFieldsWhenExternalIsSelected = false;
      this.openFieldVpn = false;

      // Clean the field school
      this.createEmployeeForm.controls['obms'].setValue(null);
      this.createEmployeeForm.controls['vtos'].setValue(null);
      this.createEmployeeForm.controls['order'].setValue(null);
      this.createEmployeeForm.controls['startOfOrderPeriod'].setValue(null);
      this.createEmployeeForm.controls['endOfOrderPeriod'].setValue(null);
      this.createEmployeeForm.controls['company'].setValue(null);
      this.createEmployeeForm.controls['vpn'].setValue(null);

    } else {

      /* If CDD CDI EXPAT */

      // Close all fields
      this.opensFieldsWhenExternalIsSelected = false;
      this.openFieldVpn = false;
      this.openFieldSchool = false;

      // Clean the field school
      this.createEmployeeForm.controls['obms'].setValue(null);
      this.createEmployeeForm.controls['vtos'].setValue(null);
      this.createEmployeeForm.controls['order'].setValue(null);
      this.createEmployeeForm.controls['startOfOrderPeriod'].setValue(null);
      this.createEmployeeForm.controls['endOfOrderPeriod'].setValue(null);
      this.createEmployeeForm.controls['company'].setValue(null);
      this.createEmployeeForm.controls['school'].setValue(null);
    }
    
  }

  /** Display or not the field "office adress" when the field place of activity is "site" */
  onEditFieldOfficeAdress(item: any): void {

    // When the field "place of activity" is "Site". Display "office adress"
    if(item.target.value.includes(Constants.SUR_SITE)) {
      this.openFieldOfficeAdress = true;

      // When the field "place of activity" isn't "Site". Hidden "office adress"
    } else {
      this.openFieldOfficeAdress = false;
      // Clean the field school
      this.createEmployeeForm.controls['officeAdress'].setValue(null);
    }
    
  }

  /** Display or not the section other equipment when click on the select "Other Equipment*/
  onEditFieldOtherEquipment(item: any): void {

    // Get the element when field change
    if(item.target.value.toLowerCase() === this.otherEquipment.toLowerCase()) {

      // When the field other equipment is displayed
      this.openFieldOtherEquipment = true;
    } else {
      this.openFieldOtherEquipment = false;
    }
  }

  /** Display or not the electronic key id when click on the select Electronic key blue */
  onEditFieldElectronicKeyBlue(item: any): void {

    // When the electronic key is "Blue Electronic key", display Electronic key ID
    if(item.target.value.toLowerCase() === ElectronicKeyEnum.ELECTRONIC_BLUE_KEY.toLowerCase()) {
      this.openFieldIdElectronicKey = true;
    } else {
      // When the electronic key isn't "Blue Electronic key", Hidden Electronic key ID
      this.openFieldIdElectronicKey = false;
    }
  }

  /** Display or not the reference user when the checkbox limas is checked */
  onEditFieldReferenceUser(item: any) {
    // When the checkbox limas is checked
    if(item.target.checked) {
      this.openFieldReferenceUser = true;
    } else {
      // When the checkbox limas isn't checked
      this.openFieldReferenceUser = false;
    }
  }

  /** Add element on list of equipments */
  onAddEquipment(equipment: string): void {
    this.equipmentResultList.push(equipment);
  }

  /** Remove element on list of equipments */
  onDeleteEquipment(equipment: number): void {
    this.equipmentResultList.splice(equipment, 1);
  }

  /** After Save reinit all fields */
  reinitAllFields() {
    this.openFieldOfficeAdress = false;
    this.opensFieldsWhenExternalIsSelected = false; // Company
    this.openFieldSchool = false;
    this.openFieldOtherEquipment = false;
    this.openFieldIdElectronicKey = false;
    this.openFieldVpn = false;
    this.openFieldReferenceUser = false;
    this.equipmentInitList = [];

  }

}