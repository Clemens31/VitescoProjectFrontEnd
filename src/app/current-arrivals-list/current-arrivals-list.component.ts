import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Arrival } from '../models/arrival';
import { ArrivalService } from '../service/arrival.service';
import { Constants } from '../utils/constants';

@Component({
  selector: 'app-current-arrivals-list',
  templateUrl: './current-arrivals-list.component.html',
  styleUrls: ['./current-arrivals-list.component.css']
})
export class CurrentArrivalsListComponent implements OnInit {

  /** Icon valid */
  iconConsult: string = Constants.ICON_CONSULT;

  /* Data */
  currentArrivalList: Arrival[];

  /* Send information to parent if pop up is closed */
  @Output() sendPopupClose = new EventEmitter();

  constructor(
    private spinner: NgxSpinnerService,
    private arrivalService: ArrivalService,
    private translate : TranslateService,
    private router : Router) { }

  ngOnInit(): void {
    this.getArrivals();

  }

  /* Get all arrival from database */
  getArrivals() : void {
    
    // Call loader
    this.spinner.show();

    // Call back end
    this.arrivalService.getArrivalsNotFullRegistry().subscribe(
      (response: any) => {
        this.currentArrivalList = response;
        this.spinner.hide();
      },
      (error: HttpErrorResponse) => {
        if(error.status == 403) {
          this.translate.get("globals.error.403").subscribe((data : any) => {
            alert(data);
            this.router.navigate(["/home"]);
          });
        } 
        // Call loader
        this.spinner.hide();
      }
    );
  }

  /* Go to the component to update the arrival */
  openScreenCurrentArrival(arrival : Arrival) {
    this.router.navigate(["/arrival/inprogress", arrival.id_arrival]);
  }

  /* Close Pop up after click on cross */
  closePopup() {
    this.sendPopupClose.emit();
  }

}
