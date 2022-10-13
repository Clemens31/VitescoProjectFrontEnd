import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from '../core/subscription';
import { ManagerService } from '../manager/services/manager.service';
import { ManagerModel } from '../models/manager.model';
import { RoleEnum } from '../models/role.enum';
import { Constants } from '../utils/constants';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent extends AbstractSubscription implements OnInit {

  /** Icon valid */
  iconSearch: string = Constants.ICON_SEARCH;
  iconValid: string = Constants.ICON_VALID;
  iconEdit: string = Constants.ICON_EDIT;
  iconDelete: string = Constants.ICON_DELETE;
  
  /** Data */
  managerList: ManagerModel[];
  currentManager: ManagerModel;

  /** List All RoleEnum */
  rolesManager : RoleEnum []= [
    RoleEnum.ROLE_SHD,
    RoleEnum.ROLE_BADGE,
    RoleEnum.ROLE_RH,
    RoleEnum.ROLE_IT,
    RoleEnum.ROLE_SURFACE,
    RoleEnum.ROLE_ORDER,
    RoleEnum.ROLE_MIL,
    RoleEnum.ROLE_ASSISTANT,
    RoleEnum.ROLE_ADMIN,
  ];

  /** Filter */
  searchManager: string;

  /** Open the pop up for edit manager / delete manager */
  displayFormEditManager = false;
  displayFormDeleteManager = false;

  /* Message if valid or error return from child component */
  returnMessageEdited: boolean = false;
  returnMessageDeleted: boolean = false;

  /* If manager has been edited / deleted */
  managerEdited: boolean = false;
  managerDeleted: boolean = false;

  constructor(private managerService: ManagerService,
              private translate : TranslateService,
              private router : Router,
              private spinner: NgxSpinnerService) { 
    super();
  }

  ngOnInit(): void {
    this.getManagers();
  }

  /** Ask the back end for get the list of managers */
  getManagers(): void {

    // Call loader
    this.spinner.show();

    this.managerService.getManagers().subscribe(
      (response: any) => {
        this.managerList = response;
        // Call loader
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

  // updateManagerlist(manageUpdated : ManagerModel) {
  //   let managerTmp = this.managerList.find(manager => 
  //     manager.badge === manageUpdated.badge);
    
  //    if(managerTmp) {
  //      managerTmp = manageUpdated;
  //      console.log("maj done");
  //    }
  // }

  /** Check all roles from BackEnd */
  checkRoles(manager : ManagerModel, role: RoleEnum) {
    if(manager.roles != null && manager.roles.length > 0) {
      for(let i = 0; i < manager.roles.length ; i++) {
        let r = manager.roles[i];
        if(r.name == role) {
          return true;
        }
      };
    }
    return false;
  }

  /*********************************************/
  /* Message Validation or Error */
  /*********************************************/

  /** Display the div returnMessage if manager has been edited or not */
  returnMessageIfManagerIsEdited(isManagerUpdated : boolean) {

    /* Delete old messages */
    this.deleteOldMessage();

    // Display the return message
    this.returnMessageEdited = true;

    if(isManagerUpdated) {
      this.managerEdited = true;
    } else {
      this.managerEdited = false;
    }
    this.displayFormEditManager = false;

    this.getManagers();

    setTimeout(() =>{
      this.deleteOldMessage();
    }, 5000);
  }

  /** Display the div returnMessage if manager has been deleted or not */
  returnMessageIfManagerIsDeleted(isManagerDeleted : boolean) {

    /* Delete old messages */
    this.deleteOldMessage();

    // Display the return message
    this.returnMessageDeleted = true;

    if(isManagerDeleted) {
      this.managerDeleted = true;
    }else {
      this.managerDeleted = false;
    }
    this.displayFormDeleteManager = false;

    this.getManagers();


    setTimeout(() =>{
      this.deleteOldMessage();
    }, 5000);
  }

  /** Delete old messages */
  deleteOldMessage() {
    this.returnMessageEdited = false;
    this.managerEdited = false;
    this.returnMessageDeleted = false;
    this.managerDeleted = false;
  }

  /*********************************************/
  /* Open Pop up */
  /*********************************************/

  /** Open the menu when click on Edit manager */
  openFormEditManager(manager : ManagerModel) {
    // manager for child
    this.currentManager = manager;
    this.displayFormEditManager = true;
  }

  /** Open the menu when click on Delete manager */
  openFormDeleteManager(manager : ManagerModel) {
    // manager for child
    this.currentManager = manager;
    this.displayFormDeleteManager = true;
  }

  /*********************************************/
  /* Close Pop up */
  /*********************************************/

  /** Close the Pop Up when the cross is pressed */
  closePopupEditManager() {
    this.displayFormEditManager = false;
  }

  /** Close the Pop Up when the cross is pressed */
  closePopupDeleteManager() {
    this.displayFormDeleteManager = false;
  }

  /*********************************************/
  /* Exports */
  /*********************************************/

  /** Export to PDF TODO */
  exportToPDF() {
    alert("Not Yet implemented");
  }

  /** Export to CSV TODO */
  exportToCSV() {
    alert("Not Yet implemented");
  }

  /*********************************************/
  /* Configuration */
  /*********************************************/
  openConfiguration() {
    alert("Not Yet implemented");
  }

}

