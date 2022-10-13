import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../core/subscription";
import { ComputerModel } from "../models/computerModel";
import { Constants } from "../utils/constants";

@Injectable()
export class ComputerModelService extends AbstractSubscription {

    constructor(private http : HttpClient) {
        super();
    }

    public getAllComputerModels(): Observable<ComputerModel[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ALL_COMPUTER_MODELS;
        return this.http.get<ComputerModel[]>(url);
    }

}