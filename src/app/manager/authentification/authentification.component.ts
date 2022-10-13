import { Component, Injectable, OnInit } from '@angular/core';
import { AbstractSubscription } from '../../core/subscription';
import { ManagerModel } from '../../models/manager.model';
import { AuthService } from './auth.service';
import { Constants } from '../../utils/constants';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerService } from '../services/manager.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
@Injectable()
export class AuthentificationComponent extends AbstractSubscription implements OnInit {

  /** Image Vitesco */
  imgInit: string = Constants.SIGN_IN_HORIZONTAL_IMAGE;

  /** FormGroup */
  userForm: FormGroup;

  /** Error Display */
  errorDisplay: string;

  /** Error Login and Server Down*/
  errorConnexion: string;


  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private translate: TranslateService,
              private managerService: ManagerService,
              private spinner: NgxSpinnerService) {
              super();
               }

  ngOnInit(): void {
    
    // Clean localstorage
    localStorage.clear();

    // Init the authentification
    this.authService.isAuth = false;
    localStorage.clear();

    // Initialisation of Form
    this.initForm();

  }

  /** Initialisation of Form */
  initForm() {
    this.userForm = this.formBuilder.group({
      badge: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  /** Event when submit button is pressed */
  onSubmitForm() {

    /** spinner starts on init */
    this.spinner.show();

    // Get information from form
    const formValue = this.userForm.value;
    const manager = new ManagerModel(
      formValue["badge"].trim(),
      formValue["password"].trim()
    );
    
    // Re init all errors
    this.errorConnexion = "";

    // Call service for verify if manager is to the LDAP
    this.authenticate(manager);

    // Disabled loader
    this.spinner.hide();

  }

  /* Call service for authentication */
  authenticate(manager: ManagerModel) {
    this.subscriptions.push(
      this.authService.authenticate(manager).subscribe({

        // If Success
        next: (value: any) => {

          console.log("Authentication - Successfull autenticate");
          localStorage.setItem("token", value.access_token);

          this.getManager(manager);
          
        },

        // If Error
        error: (err: any) => {
          console.log("Authentication - Error : " + JSON.stringify(err));
          if(err.status == 400) {
            this.translate.get("signIn.error.error400").subscribe((data: any) => {
              this.errorConnexion = data;
            });
          } else if (err.status == 403) {
            this.translate.get("signIn.error.error403").subscribe((data: any) => {
              this.errorConnexion = data;
            });
          } else {
            this.translate.get("globals.serverDown").subscribe((data: any) => {
              this.errorConnexion = data;
            });
          }
          // Disabled loader
          this.spinner.hide();
        }
      })
    );
  }

  /** GetManager */
  getManager(user: ManagerModel) {

    this.managerService.getManager(user).subscribe({
      next: (value: any) => {
        console.log("AuthentificationComponent getManager - Successfull Manager recover");
        this.authService.currentManager = value[0];
        
        // Save in localstorage the badge
        localStorage.setItem("badge", JSON.stringify(value[0].badge));
        localStorage.setItem("roles", JSON.stringify(value[0].roles));

        this.authService.managerHasRole(this.authService.currentManager);

        this.router.navigate(["/home"]);
        
        // Disabled loader
        this.spinner.hide();

      },
      error: (err : any) => {
        console.log("AuthentificationComponent getManager - Error : " + JSON.stringify(err));
        
        // Disabled loader
        this.spinner.hide();
      }
    })
  }

}
