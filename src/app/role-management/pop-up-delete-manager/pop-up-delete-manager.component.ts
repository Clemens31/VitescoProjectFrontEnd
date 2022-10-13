import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AbstractSubscription } from 'src/app/core/subscription';
import { ManagerService } from 'src/app/manager/services/manager.service';
import { ManagerModel } from 'src/app/models/manager.model';
import { Constants } from 'src/app/utils/constants';

@Component({
  selector: 'app-pop-up-delete-manager',
  templateUrl: './pop-up-delete-manager.component.html',
  styleUrls: ['./pop-up-delete-manager.component.css']
})
export class PopUpDeleteManagerComponent implements OnInit {

  /* Logo */
  imageLogo: string = Constants.LOGO_DELETE_MANAGER;

  /* Manager Data */
  @Input()
  manager: ManagerModel;

  /******************************************************* */

  /* Send information to parent if manager has been deleted */
  @Output() sendPopupManagerDeleted = new EventEmitter();

  /* Send information to parent if pop up is closed */
  @Output() sendPopupClose = new EventEmitter();


  constructor(private managerService : ManagerService) {
  }

  ngOnInit(): void {
  }

  /* After click on yes, the manager is delete */
  deleteManager() {

    this.managerService.deleteManager(this.manager.badge).subscribe(
      (data: ManagerModel) => {
        console.log("PopUpDeleteManager - Successfull Delete Manager : " 
            + this.manager.badge + " is deleted");

        // Send information to the parent for display message and delete manager
        this.managerDeleted(true);
           
      },
      // If error
      (error: HttpErrorResponse) => {
        console.log("PopUpDeleteManager - Error : " + JSON.stringify(error));
        this.managerDeleted(false);
      }
    )
  }

  /******************************************************* */

  /* Send informations if manager is deleted */
  managerDeleted(boolean : boolean) {
    this.sendPopupManagerDeleted.emit(boolean);
  }

  /* Close Pop up after click on cross or button false */
  closePopup() {
    this.sendPopupClose.emit();
  }




}
