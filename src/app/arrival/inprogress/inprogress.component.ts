import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AbstractSubscription } from 'src/app/core/subscription';
import { Arrival } from 'src/app/models/arrival';
import { ArrivalService } from 'src/app/service/arrival.service';

@Component({
  selector: 'app-inprogress',
  templateUrl: './inprogress.component.html',
  styleUrls: ['./inprogress.component.css']
})
export class InprogressComponent extends AbstractSubscription implements OnInit {

  // Arrival
  arrival: Arrival;

  // Subscription
  arrivalSubscription: Subscription;

  /** Open All Field */
  openFieldEmployee: boolean = false;
  openFieldArrival: boolean = false;
  openFieldOrder: boolean = false;
  openFieldEquipment: boolean = false;
  openFieldSchoolAndCompany: boolean = false;
  openFieldRight: boolean = false;
  openFieldComment: boolean = false;

  openFieldFirstSection: boolean = false;
  openFieldSecondSection: boolean = false;
  openFieldThirdSection: boolean = false;
  openFieldFourthSection: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private arrivalService: ArrivalService,
    private route: ActivatedRoute) { super();}

  ngOnInit(): void {

    // Call loader
    this.spinner.show();

    // Get id from param uri
    this.subscriptions.push(this.route.params.subscribe((params: Params) => {
      this.arrivalService.getArrival(params.id);
    }));

    // Subscribe 
    this.arrivalSubscription = this.arrivalService.currentArrivalSubject.subscribe(
      (arrival: Arrival) => {
        this.arrival = arrival;
        
        /** Disabled spinner */
        this.spinner.hide();
      }
    );

    // Hide Loader
    this.spinner.hide();
  }

  /** Open Field Update Employee */
  openUpdateEmployee(value : any) {

    this.closeAllFields();

    /** Open The field Employee */
    this.openFieldEmployee = true;
  }

  /** Open Field Update Arrival */
  openUpdateArrival(value : any) {

    /** Close the other Fields */
    this.closeAllFields();

    /** Open The field Arrival */
    this.openFieldArrival = true;
  }

  /** Open Field Update Order */
  openUpdateOrder(value: any) {
    
    /** Close the other Fields */
    this.closeAllFields();

    /** Open The field Order */
    this.openFieldOrder = true;
  }

  /** Open Field Update Equipment */
  openUpdateEquipment(value: any) {

    /** Close the other Fields */
    this.closeAllFields();

    /** Open The field Equipment */
    this.openFieldEquipment = true;
  }

  /** Open Field Update School and Company */
  openUpdateSchoolAndCompany(value: any) {

    /** Close the other Fields */
    this.closeAllFields();

    /** Open The field Comment */
    this.openFieldSchoolAndCompany = true;
  }

  /** Open Field Update Rights */
  openUpdateRights(value: any) {

    /** Close the other Fields */
    this.closeAllFields();

    /** Open The field Rights */
    this.openFieldRight = true;
  }

  /** Open Field First Section Right */
  openUpdateFirstSectionRight(value: any) {

    /** Close the other Fields */
    this.closeAllFields();

    /** Open The field First Section */
    this.openFieldFirstSection = true;

  }

  /** Open Field Second Section Right */
  openUpdateSecondSectionRight(value: any) {

    /** Close the other Fields */
    this.closeAllFields();
    
    /** Open The field Second Section */
    this.openFieldSecondSection = true;
    
  }

  /** Open Field Third Section Right */
  openUpdateThirdSectionRight(value: any) {
    
    /** Close the other Fields */
    this.closeAllFields();

    /** Open The field Third Section */
    this.openFieldThirdSection = true;
  }

  /** Open Field Fourth Section Right */
  openUpdateFourthSectionRight(value: any) {

    /** Close the other Fields */
    this.closeAllFields();

    /** Open The field Fourth Section */
    this.openFieldFourthSection = true;
  }


  /** Open Field Update Comment */
  openUpdateComment(value: any) {
  
    /** Close the other Fields */
    this.closeAllFields();

    /** Open The field Comment */
    this.openFieldComment = true;
  }

  /** Close all fields to update */
  closeAllFields() {

    this.refreshArrival()

    this.openFieldEmployee = false;
    this.openFieldArrival = false;
    this.openFieldOrder = false;
    this.openFieldEquipment = false;
    this.openFieldSchoolAndCompany = false;
    this.openFieldRight = false;
    this.openFieldComment = false;

    this.openFieldFirstSection = false;
    this.openFieldSecondSection = false;
    this.openFieldThirdSection = false;
    this.openFieldFourthSection = false;
  }

  /* Refresh Arrival */
  refreshArrival() {
    this.arrivalService.getArrival(this.arrival.id_arrival);
  }

}
