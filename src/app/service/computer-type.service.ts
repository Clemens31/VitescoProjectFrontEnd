import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../core/subscription";
import { ComputerType } from "../models/computerType";
import { Constants } from "../utils/constants";

@Injectable()
export class ComputerTypeService extends AbstractSubscription {

    constructor(private htpp: HttpClient) {
        super();
    }

    public getAllComputersType(): Observable<ComputerType[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ALL_TYPES_COMPUTERS;
        return this.htpp.get<ComputerType[]>(url);
    }

}