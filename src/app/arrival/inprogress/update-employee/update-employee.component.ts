import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { Arrival } from 'src/app/models/arrival';
import { Employee } from 'src/app/models/employee';
import { ArrivalService } from 'src/app/service/arrival.service';
import { Constants } from 'src/app/utils/constants';
import { ArrivalCreationService } from '../../arrival-creation-service';
import { ArrivalUpdateService } from '../../arrival-update-service';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent extends AbstractSubscription implements OnInit {

 /* **********************************  */
  /* Data   */
  /* **********************************  */

  @Input()
  arrival: Arrival;

  employee: Employee;

  /* **********************************  */
  /* Build Form   */
  /* **********************************  */

  /** FormGroup */
  updateEmployeeForm: FormGroup;


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
    private translate : TranslateService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private arrivalUpdateService : ArrivalUpdateService,
    private arrivalService: ArrivalService
    ) { 
      super()
  }

  ngOnInit(): void {
    this.initUpdateEmployeeForm();
  }

  /** Init Form */
  initUpdateEmployeeForm() {
    this.updateEmployeeForm = this.formBuilder.group({
      name: new FormControl(this.arrival.employee.name, [Validators.required]),
      firstname: new FormControl(this.arrival.employee.firstname, [Validators.required]),
      badge: new FormControl(this.arrival.employee.badge, [])
    });
  }
  
  /** Submit */
  onSubmitForm() {

    /** Display loader */
    this.spinner.show();

    // Re init the recording completed
    this.recordingCompleted ="";

    // Re init all errors
    this.errorField = "";

    try {
      let employee = this.arrivalUpdateService.checkEmployee(
        this.updateEmployeeForm.value.firstname,
        this.updateEmployeeForm.value.name,
        this.arrival.employee.id_employee,
        this.updateEmployeeForm.value.badge
      )
  
      if(!this.errorField || this.errorField != null || this.errorField == "" ) {

        this.arrival.employee = employee;

        /** Call back end for save the employee */
        this.subscriptions.push(
          this.arrivalService.updateEmployee(this.arrival).subscribe({
            
            next: (value: Arrival) => {

              console.log("Update successfull");
              this.recordingCompleted = Constants.UPDATE_COMPLETED;

              // Send information to the parent to refresh component
              this.refreshArrival();

              /** Hide loader */
              this.spinner.hide();
              
            },
            error: (err: any) => {
              console.log("Error update Employee")
              
              // Delete the message sucessfull
              this.recordingCompleted == null;

              this.errorField = JSON.stringify(err.error);
              console.log(JSON.stringify(err.error));

              // Send information to the parent to refresh component
              this.refreshArrival();
            }
          })
        );

      }

    } catch (e) {

      /* Subscribe erros */
      this.errorField = this.arrivalUpdateService.errorField;
      console.log(this.errorField);

      /** Hide loader */
      this.spinner.hide();

    }

    /** Hide loader */
    this.spinner.hide();
  }

  /* Emit for parent refresh Arrival */
  refreshArrival() {
    this.sendRefreshArrival.emit();
  }

}
