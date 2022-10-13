import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { ManagerModel } from 'src/app/models/manager.model';
import { Constants } from '../../utils/constants';
import { AuthService } from '../authentification/auth.service';
import { AuthentificationComponent } from '../authentification/authentification.component';
import { ManagerService } from '../services/manager.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends AbstractSubscription implements OnInit {

  /** Image Vitesco */
  imgInit: string = Constants.REGISTER_HORIZONTAL_IMAGE;

  /** FormGroup */
  userForm: FormGroup;

  /** Error Display */
  errorDisplay: string;

  /** Error Login and Server Down*/
  errorConnexion: string;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private authenticate : AuthentificationComponent) { 
      super();}

  ngOnInit(): void {

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

    // Call loader
    this.spinner.show();

    // Get information from form
    const formValue = this.userForm.value;
    const user = new ManagerModel(
      formValue["badge"].trim(),
      formValue["password"].trim()
    );

    // Re init all errors
    this.errorConnexion = "";

    // Call service for verify if user is to the LDAP
    this.subscriptions.push(
      this.authService.registration(user).subscribe({

        // If Success 
        next: (value: any) => {
          console.log("Register Registration - Sucessful Registration");
          
          // Call Component Authentication
          this.authenticate.authenticate(user);
        },

        // If Error
        error: (err: any) => {
          console.log("Register Registration - Error");
          if(err.status == 400) {
            this.translate.get("registration.registrationError400").subscribe((data: any) => {
              this.errorConnexion = data;
            });
          } else if (err.status == 409) {
            this.translate.get("registration.registrationError409").subscribe((data: any) => {
              this.errorConnexion = data;
            });
          } else if (err.status == 404) {
            this.translate.get("registration.registrationError404").subscribe((data: any) => {
              this.errorConnexion = data;
            })
          } else if (err.status == 401) {
            this.translate.get("registration.registrationError401").subscribe((data: any) => {
              this.errorConnexion = data;
            });
          } else {
            this.translate.get("globals.serverDown").subscribe((data: any) => {
              this.errorConnexion = data;
            });
          }     
          // Disabled loader
          this.spinner.hide();  
        },

      })
    );  
  }

}
