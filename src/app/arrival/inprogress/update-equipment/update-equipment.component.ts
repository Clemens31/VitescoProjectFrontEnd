import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { Arrival } from 'src/app/models/arrival';
import { ComputerModel } from 'src/app/models/computerModel';
import { ComputerType } from 'src/app/models/computerType';
import { Equipment } from 'src/app/models/equipment';
import { ArrivalService } from 'src/app/service/arrival.service';
import { ComputerModelService } from 'src/app/service/computer-model.service';
import { ComputerTypeService } from 'src/app/service/computer-type.service';
import { EquipmentService } from 'src/app/service/equipment.service';
import { Constants } from 'src/app/utils/constants';
import { ArrivalUpdateService } from '../../arrival-update-service';

@Component({
  selector: 'app-update-equipment',
  templateUrl: './update-equipment.component.html',
  styleUrls: ['./update-equipment.component.css']
})

export class UpdateEquipmentComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Design   */
  /* **********************************  */

  /** Icon for delete equipment */
  deletedIcon: string = Constants.ICON_DELETE;

  
  /* **********************************  */
  /* Data   */
  /* **********************************  */

  @Input()
  arrival: Arrival;
  computerModels: ComputerModel[] = [];
  computerTypes: ComputerType[] = [];

  /** List Equipment */
  listEquipmentsFromDatabase: Equipment[] = [];
  selectACategory: string;
  otherEquipment : string;

  // NgModel
  equipmentBeingRegistered: string;
  otherEquipmentBeingRegistered: string;
  equipmentResultList: Equipment[]= [];


  /* **********************************  */
  /* Build Form   */
  /* **********************************  */

  /** FormGroup */
  updateEquipmentForm: FormGroup;


  /* **********************************  */
  /* Functional Intelligence   */
  /* **********************************  */

  /** Notifies the ngIf of the change when the contract type is External */
  openFieldOtherEquipment: boolean = false;

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

  constructor(
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private computerModelService: ComputerModelService,
    private computerTypeService: ComputerTypeService,
    private equipmentService: EquipmentService,
    private arrivalUpdateService: ArrivalUpdateService,
    private arrivalService: ArrivalService
  ) { super()}

  ngOnInit(): void {

    /** Display loader */
    this.spinner.show();

    this.errorField = "";

    /** Get the value SelectACategory before the other actions */
    this.translate.get("arrival.inProgress.upateEquipment.selectACategory").subscribe((data: any) => {
      this.selectACategory = data;

      /** Init Form */
      this.initUpdateEquipmentForm();

      /** Init all fields */
      this.initAllFields();

    });

  }

  /** Init form */
  initUpdateEquipmentForm() {
    this.updateEquipmentForm = this.formBuilder.group({
      computerModel: new FormControl("", [Validators.required]),
      computerType: new FormControl("", [Validators.required]),
      nameComputer: new FormControl(this.arrival.equipmentNeed.machineName ? 
        this.arrival.equipmentNeed.machineName : "" , [Validators.required]),
        equipments: new FormControl("", []),
        otherEquipments: new FormControl("", [])
    });
  }

  /** Init all Fields */
  initAllFields() {

    /** Init Computer Model */
    this.initFieldComputerModel();

    /** Init Computer Type */
    this.initFieldComputerType();

    /** Init All equipments */
    this.initFieldEquipment();

    /** Init list Result Equipment */
    this.initListResultEquipment();

  }

  /** Init Field Computer Model */
  initFieldComputerModel() {

    // Add selectACategory
    this.computerModels.push(this.arrival.equipmentNeed.computerModel);
    
    // Get list ComputerModel from database
    this.computerModelService.getAllComputerModels().subscribe(
      (response: any) => {
        response.forEach((element: ComputerModel) => {

          /* Except Value select in the arrival */
          if(element.name.toLowerCase() != this.arrival.equipmentNeed.computerModel.name.toLowerCase()) {
            this.computerModels.push(element);
          }

        });
      },
      (error: HttpErrorResponse) => {
        this.errorField = error.error;
      }
    );
  }

  /** Init Field Computer Type */
  initFieldComputerType() {

    // Add selectACategory
    this.computerTypes.push(this.arrival.equipmentNeed.computerType);
    
    // Get list Computer Type from database
    this.computerTypeService.getAllComputersType().subscribe(
      (response: any) => {
        response.forEach((element: ComputerType) => {

          /* Except Value select in the arrival */
          if(element.name.toLowerCase() != this.arrival.equipmentNeed.computerType.name.toLowerCase()) {
            this.computerTypes.push(element);
          }

        });
      },
      (error: HttpErrorResponse) => {
        this.errorField = error.error;
      }
    );
  }

  /** Init Field Equipment */
  initFieldEquipment() {

    // Add select a category
    this.listEquipmentsFromDatabase.push(new Equipment(this.selectACategory, false));

    // Get list Equipment from database
    this.equipmentService.getAllEquipments().subscribe(
      (response: any) => {
        response.forEach((element: Equipment) => {
          this.listEquipmentsFromDatabase.push(element);
        });

      /** Get name "Other Equipment" in TS */
      this.translate.get("arrival.createEmployee.equipment.otherEquipment").subscribe((data: any) => {
      this.otherEquipment = data;

      /** Initilisation list equipment in select option when the subscribe is over */
      this.listEquipmentsFromDatabase.push(new Equipment(this.otherEquipment, false));
      this.spinner.hide();

      });
      
      },
      (error: HttpErrorResponse) => {
        this.errorField = JSON.stringify(error.error);
        this.spinner.hide();
      }
    );
    
  }

  /** Init list Result Equipment already saved */
  initListResultEquipment() {

    // Get list Equipment already saved from database
    for(let element of this.arrival.equipmentNeed.equipmentList) {
      this.equipmentResultList.push(element);
    }
    
  }

  /*********************************************/
  /* Interaction */
  /*********************************************/

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

  /** Add element on list of equipments */
  onAddEquipment(): void {

    if(this.equipmentBeingRegistered != undefined && this.equipmentBeingRegistered != null && 
      this.equipmentBeingRegistered.toLowerCase().trim() != this.selectACategory.toLowerCase().trim()) {

        /** Add equipment is exists */
        for(let equipment of this.listEquipmentsFromDatabase) {
          if(equipment.name.toLowerCase().trim() == this.equipmentBeingRegistered.toLowerCase().trim()) {
            this.equipmentResultList.push(
              new Equipment(equipment.name, false, equipment.id_equipment, false, false));
          }
        }

    }
  }

  /** Add element from other equipment */
  onAddOtherEquipment(): void {

    if(this.otherEquipmentBeingRegistered != null && this.otherEquipmentBeingRegistered != "") {

      this.equipmentResultList.push(
        new Equipment(this.otherEquipmentBeingRegistered, false, null!, false, false));
    }
    
  }

  /** Remove element on list of equipments */
  onDeleteEquipment(id: number): void {
    this.equipmentResultList.splice(id, 1);
  }

  /* Update the checbkox statut */
  updateAttribute(id : number): void {
    this.equipmentResultList[id].attributed = !this.equipmentResultList[id].attributed;
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

    this.spinner.hide();

    // Call back end
    try  {
      let equipmentNeedToUpdated = this.arrivalUpdateService.checkInformationsEquipmentNeed(
        this.updateEquipmentForm.value, this.arrival,
        this.computerModels, this.computerTypes, this.equipmentResultList);

      /* If everything is good */
      if(!this.errorField || this.errorField != null || this.errorField == "") {
        
        /** Call back end for update the new Arrival */ 
        this.updateEquipmentNeed(equipmentNeedToUpdated);

        // Send information to the parent to refresh component
        this.refreshArrival();

        /** Hide loader */
        this.spinner.hide();

      }

    } catch (e) {

      /* Subscribe erros */
      this.errorField = this.arrivalUpdateService.errorField;
      console.log(this.errorField);

      // Send information to the parent to refresh component
      this.refreshArrival();

      /** Hide loader */
      this.spinner.hide();
    }
  }

  /* Call back end */
  updateEquipmentNeed(equipmentNeedToUpdated: Arrival){

    /** Call back end for update the new EquipmentNeed */ 
    this.subscriptions.push(
      this.arrivalService.updateEquipmentNeed(equipmentNeedToUpdated).subscribe({
        
        next: (value: Arrival) => {
          
        console.log("Update successfull");
        this.recordingCompleted = Constants.UPDATE_COMPLETED;

        // Clean message error and additionalInformations
        this.errorField = "";

        // Send information to the parent to refresh component
        //this.refreshArrival();

        /** Display loader */
        this.spinner.hide();

        /* Remove message after 5sec */
        setTimeout(() => {
          // Call the setDelay function again with the remaining times
          this.recordingCompleted = "";
      }, 5000);

        },
        error: (err: any) => {
          console.log("Error update EquipmentNeed : "+ JSON.stringify(err));

          // Delete the message sucessfull
          this.recordingCompleted = "";

          this.errorField = JSON.stringify(err.error);
          console.log(JSON.stringify(err.error));
          
        }      
      })
    );
 }

  /* Emit for parent refresh Arrival */
  refreshArrival() {
    this.sendRefreshArrival.emit();
  }

}
