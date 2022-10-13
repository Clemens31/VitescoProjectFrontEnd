import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../core/subscription";
import { Platform } from "../models/platform";
import { Constants } from "../utils/constants";

@Injectable()
export class PlatformService extends AbstractSubscription {

    constructor(private http : HttpClient) {
        super();
    }

    public getAllPlatforms(): Observable<Platform[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_ALL_PLATFORMS;
        return this.http.get<Platform[]>(url);
    }

}