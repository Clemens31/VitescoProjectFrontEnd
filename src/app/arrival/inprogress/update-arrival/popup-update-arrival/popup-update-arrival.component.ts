import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Arrival } from 'src/app/models/arrival';

@Component({
  selector: 'app-popup-update-arrival',
  templateUrl: './popup-update-arrival.component.html',
  styleUrls: ['./popup-update-arrival.component.css']
})
export class PopupUpdateArrivalComponent implements OnInit {

  /** Data */
  @Input()
  arrival: Arrival;

  /* Messages */
  @Input()
  messages: string[];

  /* Send information to parent if pop up is closed */
  @Output() 
  sendPopupClose = new EventEmitter();

  /* Send information to parent to save the arrival */
  @Output()
  sendUpdateArrival = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  /* Close the component */
  onNoButton() {
    this.closePopup();
  }

  /* Udate Arrival */
  onYesButton() {
    this.sendUpdateArrival.emit(this.arrival);
    this.closePopup();
  }

  /* Close Pop up after click on cross */
  closePopup() {
    this.sendPopupClose.emit();
  }

}
