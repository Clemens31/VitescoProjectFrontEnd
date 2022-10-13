import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../core/subscription";
import { Equipment } from "../models/equipment";
import { Constants } from "../utils/constants";

@Injectable()
export class EquipmentService extends AbstractSubscription {

    constructor(private http: HttpClient) {
        super();
    }

    public getAllEquipments(): Observable<Equipment[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ALL_EQUIPMENTS;
        return this.http.get<Equipment[]>(url);
    }

}