import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './manager/authentification/auth.service';
import { ManagerModel } from './models/manager.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /* Manager */
  manager: ManagerModel;

  /* URL */
  urlAuth : string = "http://localhost:4200/auth"
  urlRegister : string = "http://localhost:4200/registration"

  /** Translate */
  constructor(private translateService: TranslateService,
              private authService : AuthService,
              private spinner : NgxSpinnerService) {
          
    // Register translation languages
    translateService.addLangs(['en', 'fr']);
    translateService.setDefaultLang('fr');
  }

  ngOnInit() {

    // Loader 
    this.spinner.show();

    // If url isn't auth or registration
    if(window.location.href != this.urlAuth ) {
      if (window.location.href != this.urlRegister) {
        // If manager doesn't exist or F5
        if(this.manager == null || this.manager === undefined) {
    
          // Get information on Datastorage
          let badge = this.authService.getBadge();
          
          if(badge == null) {
            // Disabled loader
            this.spinner.hide();

            this.authService.logout();
            
          }
          // Add information on the manager
          let manager = new ManagerModel(JSON.parse(this.authService.getBadge() || ""), "");

          // Call service for get information about manager
          this.authService.setManager(manager);
          this.manager = this.authService.currentManager;

          // Disabled loader
          this.spinner.hide();
          
        }
      }

    }
    // Disabled loader
    this.spinner.hide();
  }
}
