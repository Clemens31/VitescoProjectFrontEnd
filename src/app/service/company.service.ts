import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../core/subscription";
import { Company } from "../models/company";
import { Constants } from "../utils/constants";

@Injectable()
export class CompanyService extends AbstractSubscription {

    constructor(private http: HttpClient) {
        super();
    }

    public getAllCompagnies(): Observable<Company[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ALL_COMPANIES;
        return this.http.get<Company[]>(url);
    }


}