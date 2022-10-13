import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractSubscription } from "../../core/subscription";
import { ManagerModel } from "../../models/manager.model";
import { Constants } from "../../utils/constants";

@Injectable()
export class ManagerService extends AbstractSubscription{

    constructor(private http : HttpClient) {
        super();
    }

    public getManagers(): Observable<ManagerModel[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_MANAGERS;
        return this.http.get<ManagerModel[]>(url);
    }
    
    public getManager(manager: ManagerModel): Observable<ManagerModel[]> {
        const url = environment.BACKEND_URL + "/" + Constants.GET_MANAGER;
        return this.http.post<ManagerModel[]>(url, manager);
    }
    
    public updateManager(manager: ManagerModel): Observable<ManagerModel> {
        const url = environment.BACKEND_URL + "/" + Constants.UPDATE_MANAGER;
        return this.http.put<ManagerModel>(url, JSON.stringify(manager));
    }

    public deleteManager(badge: string): Observable<any> {
        const url = environment.BACKEND_URL + "/" + Constants.DELETE_MANAGER;
        return this.http.delete<ManagerModel>(`${url}/${badge}`);
    }

}