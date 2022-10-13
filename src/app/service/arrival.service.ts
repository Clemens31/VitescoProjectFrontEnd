import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../core/subscription";
import { Arrival } from "../models/arrival";
import { Constants } from "../utils/constants";

@Injectable()
export class ArrivalService extends AbstractSubscription {

    /* 1 Declaration property and Subject */
    private currentArrival: Arrival;
    currentArrivalSubject = new Subject<Arrival>();

    constructor(private http: HttpClient,
        private translate : TranslateService,
        private router : Router) {
        super();
    }

    /* 2 Create method for emet the subject */
    emitCurrentArrivalSubject() {
        this.currentArrivalSubject.next(this.currentArrival);
    }

    /***************************************************** */

    /** Get Arrival */
    getArrival(id: number) {

        // Call back end
        this.getArrivalFromDatabase(id).subscribe(

            (response: any) => {
                this.currentArrival = response;
                this.emitCurrentArrivalSubject();
            },

            (error: HttpErrorResponse) => {
                if(error.status == 403) {
                    this.translate.get("globals.error.403").subscribe((data : any) => {
                    alert(data);
                    this.router.navigate(["/home"]);
                    });
                } 
                if(error.status == 404) {
                    this.translate.get("arrival.inProgress.error.error404").subscribe((data : any) => {
                    alert(data);
                    this.router.navigate(["/home"]);
                    })
                }
            }
        );
    }

    /***************************************************** */

    public getArrivals(): Observable<Arrival[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ARRIVALS;
        return this.http.get<Arrival[]>(url);
    } 
    
    public getArrivalsNotFullRegistry(): Observable<Arrival[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ARRIVALS_NOT_FULL_REGISTRY;
        return this.http.get<Arrival[]>(url);
    }

    public getArrivalFromDatabase(id: number): Observable<Arrival> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ARRIVAL + "/" + id;
        return this.http.get<Arrival>(url);
    }

    public creationArrival(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.SAVE_ARRIVAL;
        return this.http.post(url, arrival)
    }
    
    /*********************************************/
    /* Update Arrival */
    /*********************************************/

    public updateEmployee(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_EMPLOYEE; 
        return this.http.put(url, arrival);
    }

    public updateArrival(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_ARRIVAL;
        return this.http.put(url, arrival);
    }

    public updateOrder(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_ORDER;
        return this.http.put(url, arrival);
    }

    public updateEquipmentNeed(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_EQUIPMENT_NEED;
        return this.http.put(url, arrival);
    }

    public updateSchoolOrCompany(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_SCHOOL_OR_COMPANY;
        return this.http.put(url, arrival);
    }

    public updateComment(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_COMMENT;
        return this.http.put(url, arrival);
    }

    public updateRight(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_RIGHT;
        return this.http.put(url, arrival);
    }

    public updateRightFirstSection(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_RIGHT_FIRST_SECTION;
        return this.http.put(url, arrival);
    }

    public updateRightSecondSection(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_RIGHT_SECOND_SECTION;
        return this.http.put(url, arrival);
    }

    public updateRightThirdSection(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_RIGHT_THIRD_SECTION;
        return this.http.put(url, arrival);
    }

    public updateRightFourthSection(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_RIGHT_FOURTH_SECTION;
        return this.http.put(url, arrival);
    }

    /*********************************************/
    /* Delete and Closing Arrival */
    /*********************************************/

    public deleteArrival(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.DELETE_ARRIVAL + 
        "/" + arrival.id_arrival;
        return this.http.delete(url);
    }

    public closeArrival(arrival: Arrival): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.CLOSING_ARRIVAL;
        return this.http.put(url, arrival);
    }


}