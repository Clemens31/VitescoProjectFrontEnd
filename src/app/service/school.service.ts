import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../core/subscription";
import { School } from "../models/school";
import { Constants } from "../utils/constants";

@Injectable()
export class SchoolService extends AbstractSubscription {

    constructor(private http : HttpClient) {
        super();
    }

    public getAllSchools(): Observable<School[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ALL_SCHOOLS;
        return this.http.get<School[]>(url);
    }
    
}