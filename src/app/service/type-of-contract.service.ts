import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../core/subscription";
import { TypeOfContract } from "../models/typeOfContract";
import { Constants } from "../utils/constants";

@Injectable()
export class TypeOfContractService extends AbstractSubscription {

    constructor(private http : HttpClient) {
        super();
    }

    public getAllTypeOfContract(): Observable<TypeOfContract[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ALL_TYPEOFCONTRACT;
        return this.http.get<TypeOfContract[]>(url);
    }
}