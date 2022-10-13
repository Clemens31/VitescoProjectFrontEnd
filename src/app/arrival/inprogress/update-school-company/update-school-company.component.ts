import { HttpErrorResponse } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { Arrival } from 'src/app/models/arrival';
import { Company } from 'src/app/models/company';
import { School } from 'src/app/models/school';
import { ArrivalService } from 'src/app/service/arrival.service';
import { CompanyService } from 'src/app/service/company.service';
import { SchoolService } from 'src/app/service/school.service';
import { Constants } from 'src/app/utils/constants';
import { ArrivalUpdateService } from '../../arrival-update-service';

@Component({
  selector: 'app-update-school-company',
  templateUrl: './update-school-company.component.html',
  styleUrls: ['./update-school-company.component.css']
})
export class UpdateSchoolCompanyComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Data   */
  /* **********************************  */

  @Input()
  arrival: Arrival;

  /** Get name "Select a category" in TS */
  selectACategory: string;

  // Value for html ngIf
  stageLess3 =  Constants.STAGE_MOINS_3_MOIS.toLowerCase();
  stage3AndMore =  Constants.STAGE_3_MOIS_ET_PLUS.toLowerCase();
  alternant =  Constants.ALTERNANT.toLowerCase();
  externe =  Constants.EXTERNE.toLowerCase();
  cdd =  Constants.CDD.toLowerCase();
  cdi =  Constants.CDI.toLowerCase();
  expat =  Constants.EXPAT.toLowerCase();

  // Value to select option
  listSchool: School[] = [];
  listCompany: Company[] = [];

  /* **********************************  */
  /* Build Form   */
  /* **********************************  */

  /** FormGroup */
  updateSchoolOrCompanyForm: FormGroup;

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
    private companyService: CompanyService,
    private schoolService: SchoolService,
    private arrivalUpdateService: ArrivalUpdateService,
    private arrivalService: ArrivalService) { super()}

  ngOnInit(): void {

    /** Display loader */
    this.spinner.show();

    /** Init Form */
    this.initUpdateSchoolOrCompanyForm();
    
    /** Get the value SelectACategory before the other actions FOR ALL SELECT */
    this.translate.get("arrival.createEmployee.selectACategory").subscribe((data: any) => {
      this.selectACategory = data;

      /** Init List company and School */
      this.initFieldListSchool();
      this.initFieldListCompany();

      /** Hide loader */
      this.spinner.hide();
    });
    
  }

  /* Init Form */
  initUpdateSchoolOrCompanyForm() {
    
    this.updateSchoolOrCompanyForm = this.formBuilder.group({
      school: new FormControl("", []),
      company: new FormControl("", []),
    })
  }

  /** Init Field List School */
  initFieldListSchool() {

    // Add the name of the school selected if School exists
    if(this.arrival.school) {
      this.listSchool.push(
        new School(
          this.arrival.school.name,
          this.arrival.school.id_school,
          this.arrival.school.expiry_date_prevention_plan,
          this.arrival.school.archived
        )
      );

      // Get list school from database
      this.schoolService.getAllSchools().subscribe(
        (response: any) => {
          response.forEach((element: School) => {

            // Add the list of schools except the one that is in the arrival object
            if(this.arrival.school.name.toLowerCase() != element.name.toLowerCase()) {

              this.listSchool.push(
                new School(
                  element.name.toLowerCase(), 
                  element.id_school!, 
                  element.expiry_date_prevention_plan!, 
                  element.archived!));

            }
          });
        },
        (error: HttpErrorResponse) => {
          this.errorField = error.error;
        }
      );

    // Add list if School doesn't exists
    } else {

      // Add select a category
      this.listSchool.push(new School (this.selectACategory));

      // Get list school from database
      this.schoolService.getAllSchools().subscribe(
        (response: any) => {
          response.forEach((element: School) => {

            this.listSchool.push(
              new School(
                element.name.toLowerCase(), 
                element.id_school!, 
                element.expiry_date_prevention_plan!, 
                element.archived!));

          });
        },
        (error: HttpErrorResponse) => {
          this.errorField = error.error;
        }
      );

    }
    
   
  }

  /** Init Field List Company */
  initFieldListCompany() {
    
    // Add the name of the company selected
    if(this.arrival.company) {
      this.listCompany.push(
        new Company(
          this.arrival.company.name,
          this.arrival.company.id_company,
          this.arrival.company.expiry_date_prevention_plan,
          this.arrival.company.archived));

      // Get list Company from database
      this.companyService.getAllCompagnies().subscribe(
        (response: any) => {
          response.forEach((element: Company) => {

            // Add the list of companies except the one that is in the arrival object
            if(this.arrival.company.name.toLowerCase() != element.name.toLowerCase()) {

              this.listCompany.push(
                new Company(
                  element.name.toLowerCase(), 
                  element.id_company!, 
                  element.expiry_date_prevention_plan!, 
                  element.archived!));
            }
        });
      },
      (error: HttpErrorResponse) => {
        this.errorField = error.error;
      }
    );
      
    } else {

      // Add select a category
      this.listCompany.push(new Company (this.selectACategory));

    // Get list Company from database
    this.companyService.getAllCompagnies().subscribe(
      (response: any) => {
        response.forEach((element: Company) => {

          this.listCompany.push(
            new Company(
              element.name.toLowerCase(), 
              element.id_company!, 
              element.expiry_date_prevention_plan!, 
              element.archived!));
  
        });
      },
      (error: HttpErrorResponse) => {
        this.errorField = error.error;
      }
    );

    }
    

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
      let schoolOrCompany = this.arrivalUpdateService.checkInformationsSchoolCompanyUpdate(
        this.updateSchoolOrCompanyForm.value, this.arrival, 
        this.selectACategory, this.listSchool, this.listCompany); 

      /** Call back end for update the school or company */
      this.updateSchoolOrCompany(schoolOrCompany);

      /** Hide loader */
      this.spinner.hide();


    } catch (e) {

      /* Subscribe erros */
      this.errorField = this.arrivalUpdateService.errorField;
      console.log(this.errorField);

      /** Hide loader */
      this.spinner.hide();
    }
  }


  /*********************************************/
  /* Update School or Company */
  /*********************************************/

  /** Call back end for the update */
  updateSchoolOrCompany(schoolOrCompany: Arrival) {

    /** Call back end for update the new Arrival */ 
    this.subscriptions.push(
      this.arrivalService.updateSchoolOrCompany(schoolOrCompany).subscribe({
        
        next: (value: Arrival) => {
          
        console.log("Update successfull");
        this.recordingCompleted = Constants.UPDATE_COMPLETED;

        // Clean message error and additionalInformations
        this.errorField = "";

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

          this.errorField = JSON.stringify(err.error);
            console.log(JSON.stringify(err.error));
        }      
      })
    );

  }

}
