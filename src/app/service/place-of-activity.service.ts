import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../core/subscription";
import { PlaceOfActivity } from "../models/placeOfActivity";
import { Constants } from "../utils/constants";

@Injectable()
export class PlaceOfActivityService extends AbstractSubscription {

    constructor(private http : HttpClient) {
        super();
    }

    public getAllPlaceOfActivity(): Observable<PlaceOfActivity[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ALL_PLACEOFACTIVITY;
        return this.http.get<PlaceOfActivity[]>(url);
    }

}