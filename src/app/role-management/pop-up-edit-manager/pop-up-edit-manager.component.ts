import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ManagerService } from 'src/app/manager/services/manager.service';
import { ManagerModel } from 'src/app/models/manager.model';
import { RoleEnum } from 'src/app/models/role.enum';
import { Role } from 'src/app/models/role.model';
import { Constants } from 'src/app/utils/constants';

@Component({
  selector: 'app-pop-up-edit-manager',
  templateUrl: './pop-up-edit-manager.component.html',
  styleUrls: ['./pop-up-edit-manager.component.css']
})
export class PopUpEditManagerComponent implements OnInit {
  
  /* Logo */
  imageLogo: string = Constants.LOGO_EDIT_MANAGER;

  /* Manager Data */
  @Input()
  manager: ManagerModel;

  /** FormGroup */
  editManagerForm: FormGroup


  /******************************************************* */

  /* Send information to parent if manager has been edited */
  @Output() sendPopupManagerEdited = new EventEmitter();
 
  /* Send information to parent if pop up is closed */
  @Output() sendPopupClose = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private managerService: ManagerService) { 
  }

  ngOnInit(): void {
    this.initForm();
  }

  /* Init the form */
  initForm() {
    this.editManagerForm = this.formBuilder.group({
      badgeName: [this.manager.badge, Validators.required],
      roles: new FormGroup({
        shd: new FormControl(this.initCheckbox(RoleEnum.ROLE_SHD)),
        badge: new FormControl(this.initCheckbox(RoleEnum.ROLE_BADGE)),
        rh: new FormControl(this.initCheckbox(RoleEnum.ROLE_RH)),
        it: new FormControl(this.initCheckbox(RoleEnum.ROLE_IT)),
        surface: new FormControl(this.initCheckbox(RoleEnum.ROLE_SURFACE)),
        order: new FormControl(this.initCheckbox(RoleEnum.ROLE_ORDER)),
        mil: new FormControl(this.initCheckbox(RoleEnum.ROLE_MIL)),
        assistant: new FormControl(this.initCheckbox(RoleEnum.ROLE_ASSISTANT)),
        admin: new FormControl(this.initCheckbox(RoleEnum.ROLE_ADMIN))
      }),
    });
  }
  
  /* Put checbkox at true or false */
  initCheckbox(role: RoleEnum) {
    if(this.manager.roles != null && this.manager.roles.length > 0) {
      for(let i = 0; i < this.manager.roles.length ; i++) {
        let r = this.manager.roles[i];
        if(r.name == role) {
          return true;
        }
      };
    }
    return false;
  }

  /* Edit employee when click on Edit */
  onSubmitForm() {
    // Get value from form
    const formValue = this.editManagerForm.value;

    // Get all roles
    let roles : Role[] = this.addRoles(formValue);

    // Create temp manager
    let managerTmp : ManagerModel = Object.assign(this.manager);

    // Change roles 
    managerTmp.roles = roles;

    // Call Service 
    this.managerService.updateManager(managerTmp).subscribe(
      (data : ManagerModel) => {
        console.log("PopUpNewManager - Successfull Edit Manager");

        // Update the managerList
        if(data) {
          this.manager = data;
          // Send information to the parent for display message
          this.sendPopUpEmited(true);
        }
      },
      // If Error
      (error : HttpErrorResponse) => {
        console.log("PopUpNewManager - Error : " + error);
        this.sendPopUpEmited(false);
      }
    );
  }

  
  /** Add roles selected on the list of Roles */
  addRoles(formValue: any): Role[] {
    let roles : Role[] = [];

    if(formValue["roles"]["shd"]) {
      roles.push(new Role(RoleEnum.ROLE_SHD));
    } 
    if(formValue["roles"]["badge"]) {
      roles.push(new Role(RoleEnum.ROLE_BADGE));
    } 
    if(formValue["roles"]["rh"]) {
      roles.push(new Role(RoleEnum.ROLE_RH));
    } 
    if(formValue["roles"]["it"]) {
      roles.push(new Role(RoleEnum.ROLE_IT));
    } 
    if(formValue["roles"]["surface"]) {
      roles.push(new Role(RoleEnum.ROLE_SURFACE));
    }
    if(formValue["roles"]["order"]) {
      roles.push(new Role(RoleEnum.ROLE_ORDER));
    } 
    if(formValue["roles"]["mil"]) {
      roles.push(new Role(RoleEnum.ROLE_MIL));
    }
    if(formValue["roles"]["assistant"]) {
      roles.push(new Role(RoleEnum.ROLE_ASSISTANT));
    } 
    if(formValue["roles"]["admin"]) {
      roles.push(new Role(RoleEnum.ROLE_ADMIN));
    }

    return roles;
  }

  /******************************************************* */

  /* Send information for display valid or error message */
  sendPopUpEmited(ManagerIsUpdated : boolean) {
    this.sendPopupManagerEdited.emit(ManagerIsUpdated);
  }

  /* Close Pop up after click on cross */
  closePopup() {
    this.sendPopupClose.emit();
  }


}
