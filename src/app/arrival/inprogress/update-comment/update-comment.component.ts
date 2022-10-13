import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractSubscription } from 'src/app/core/subscription';
import { AuthService } from 'src/app/manager/authentification/auth.service';
import { Arrival } from 'src/app/models/arrival';
import { Comment } from 'src/app/models/comment';
import { ArrivalService } from 'src/app/service/arrival.service';
import { Constants } from 'src/app/utils/constants';
import { ArrivalCreationService } from '../../arrival-creation-service';

@Component({
  selector: 'app-update-comment',
  templateUrl: './update-comment.component.html',
  styleUrls: ['./update-comment.component.css']
})
export class UpdateCommentComponent extends AbstractSubscription implements OnInit {

  /* **********************************  */
  /* Data   */
  /* **********************************  */

  @Input()
  arrival: Arrival;


  /* **********************************  */
  /* Build Form   */
  /* **********************************  */

  /** FormGroup */
  updateCommentForm: FormGroup;


  /* **********************************  */
  /* Section Successfull  */
  /* **********************************  */

  /* If recording completed */
  recordingCompleted: string;


  /* **********************************  */
  /* Section Errors  */
  /* **********************************  */

  /** List messages Errors */
  errorField : string;


  /* **********************************  */
  /* Send information to parent to refresh Arrival */
  /* **********************************  */

  @Output() 
  sendRefreshArrival = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private arrivalCreationService: ArrivalCreationService,
    private arrivalService: ArrivalService,
    private authService: AuthService
  ) { 
    super()}

  ngOnInit(): void {
    this.initUpdateCommentForm();
  }

  /** Init Form */
  initUpdateCommentForm() {
    this.updateCommentForm = this.formBuilder.group({
      comment: new FormControl("", [])
    });
  }

  /** Submit */
  onSubmitForm() {

    /** Display loader */
    this.spinner.show();

    // Re init the recording completed
    this.recordingCompleted ="";

    // Re init all errors
    this.errorField = "";

    /** Hide loader */
    this.spinner.hide();

    /** Clean the field comment */
    if(this.updateCommentForm.value.comment != null && this.updateCommentForm.value.comment.trim() != "") {
      
      // Create object Comment
      let newComment = new Comment(
        this.updateCommentForm.value.comment.trim().toLowerCase(),
        this.authService.currentManager
      );

      this.arrival.commentList.push(newComment);

      try {
        /** Call back end for save the comment */
        this.subscriptions.push(
          this.arrivalService.updateComment(this.arrival).subscribe({
            next: (value: Arrival) => {
  
              console.log("Update successfull");
              this.recordingCompleted = Constants.UPDATE_COMPLETED;

              // Send information to the parent to refresh component
              this.refreshArrival();
  
              /** Hide loader */
              this.spinner.hide();
              
            },
  
            error: (err: any) => {
              console.log("Error update Comment")
              
              // Delete the message sucessfull
              this.recordingCompleted == null;
  
              // Add message error
              this.errorField = JSON.stringify(err.error);

              // Send information to the parent to refresh component
              this.refreshArrival();
            
            }
          })
        )
  
      } catch (e) {
  
        /* Subscribe erros */
        this.errorField = this.arrivalCreationService.errorField;
        console.log(this.errorField);
  
        /** Hide loader */
        this.spinner.hide();
  
      }
    }

    


  }

  /* Emit for parent refresh Arrival */
  refreshArrival() {
    this.sendRefreshArrival.emit();
  }

}
