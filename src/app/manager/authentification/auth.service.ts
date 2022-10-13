import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from "rxjs";
import { RoleEnum } from "src/app/models/role.enum";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../../core/subscription";
import { ManagerModel } from "../../models/manager.model";
import { Constants } from "../../utils/constants";
import { ManagerService } from "../services/manager.service";

@Injectable()
export class AuthService extends AbstractSubscription {

  isAuth = false;
  currentManager : ManagerModel;
  managerSubject = new Subject<ManagerModel>();

  managerIsAdmin : boolean = false;
  managerIsShdResponsible : boolean = false;
  managerIsBadgeResponsible : boolean = false;
  managerIsrhIsResponsible : boolean = false;
  managerIsItResponsible : boolean = false;
  managerIsSurfaceResponsible : boolean = false;
  managerIsOrderResponsible : boolean = false;
  managerIsMilResponsible : boolean = false;
  managerIsAssistantResponsible : boolean = false;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private managerService : ManagerService,
              private spinner : NgxSpinnerService){
              super();
  }

  emitManagerSubject() {
    this.managerSubject.next(this.currentManager);
  }

  /**
   * Verify if user can log in LDAP
   * @param user 
   * @returns 
   */
  authenticate(user: ManagerModel): Observable<any>{

    // Url Called
    const url = environment.BACKEND_URL + "/" + Constants.AUTHENTICATE ;
    console.log("AuthService: Call the LDAP to the adress: " + url );
    
    // Build params
    const body = new HttpParams()
    .set('username', user.badge)
    .set('password', user.password);

    // Return Token
    return this.httpClient.post(url, body.toString())
    
  }

  /** GetManager */
  setManager(user: ManagerModel) {

    // Loader 
    this.spinner.show();

    this.managerService.getManager(user).subscribe({
      next: (value: ManagerModel[]) => {
        console.log("AuthService setManager - Successfull Manager recover : " +JSON.stringify(value[0].badge));
        
        this.currentManager = value[0];
        this.managerHasRole(this.currentManager);

        // Disabled loader
        this.spinner.hide(); 
      },
      error: (err : any) => {
        console.log("AuthService setManager - Error : " + JSON.stringify(err));

        // Disabled loader
        this.spinner.hide();
        
      }
    });
  }

  /**
   * Registre a new user
   * @param user 
   * @returns 
   */
  registration(user: ManagerModel): Observable<any> {

    const url = environment.BACKEND_URL + "/" + Constants.REGISTER ;
    console.log("AuthService: Call the LDAP to the adress: " + url );

    const newManager = this.convertManagerDTOtoModel(user);

    // Create the new manager
    return this.httpClient.post(url, newManager);

  }
  
  /** Get token from localStorage */
  getToken() {
    return localStorage.getItem("token");
  }

  /** Get Badge from localStorage */
  getBadge() {
    return localStorage.getItem("badge");
  }

  /** Get Roles from localStorage */
  getRoles() {
    return localStorage.getItem("roles");
  }

  /* Convert Manager DTO to Model */
  convertManagerDTOtoModel(value: any): ManagerModel {
    const manager = value;
    return manager;
  }

  isManagerAdmin(manager: ManagerModel): boolean {
    return manager && manager.roles && manager.roles.length > 0 ? 
      manager.roles.some(role => role.name === RoleEnum.ROLE_ADMIN) : 
      false;
  }

  isManagerSHD_SHD(manager: ManagerModel): boolean {
    return manager && manager.roles && manager.roles.length > 0 ? 
      manager.roles.some(role => role.name === RoleEnum.ROLE_SHD) : 
      false;
  }

  isOnlyUser(manager: ManagerModel): boolean {
    return manager && manager.roles && manager.roles.length > 0 ?
    manager.roles.length === 1 :
    false;
  }

  /* From the manager to determine the roles */
  managerHasRole(manager : ManagerModel) {

    manager.roles.forEach(role => {
      switch(role.name) {
        case RoleEnum.ROLE_ADMIN: {
          this.managerIsAdmin = true;
          break;
        }
        case RoleEnum.ROLE_SHD: {
          this.managerIsShdResponsible = true;
          break;
        }
        case RoleEnum.ROLE_BADGE: {
          this.managerIsBadgeResponsible = true;
          break;
        }

        case RoleEnum.ROLE_RH: {
          this.managerIsrhIsResponsible = true;
          break;
        }

        case RoleEnum.ROLE_IT: {
          this.managerIsItResponsible = true;
          break;
        }

        case RoleEnum.ROLE_SURFACE: {
          this.managerIsSurfaceResponsible = true;
          break;
        }

        case RoleEnum.ROLE_ORDER: {
          this.managerIsOrderResponsible = true;
          break;
        }

        case RoleEnum.ROLE_MIL: {
          this.managerIsMilResponsible = true;
          break;
        }

        case RoleEnum.ROLE_ASSISTANT: {
          this.managerIsAssistantResponsible = true;
          break;
        }
      }
    });
  }


  /** Deconnexion */
  logout() {
    console.log("AuthService: Deconnexion")

    this.isAuth = false;
    this.deleteRole();

    this.router.navigate(["/"]);
  }

  /** Delete all roles */
  deleteRole() {
    this.managerIsAdmin = false;
    this.managerIsShdResponsible = false;
    this.managerIsBadgeResponsible = false;
    this.managerIsrhIsResponsible = false;
    this.managerIsItResponsible = false;
    this.managerIsSurfaceResponsible = false;
    this.managerIsOrderResponsible = false;
    this.managerIsMilResponsible = false;
    this.managerIsAssistantResponsible = false;
  }

}