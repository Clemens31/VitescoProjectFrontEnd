import { Role } from "./role.model";

export class ManagerModel {
    id_manager: number;
    badge: string;
    firstname: string;
    name: string;
    password: string;
    roles: Role[];

    constructor(badge: string, password: string, id_manager?: number, 
        firstname?: string, name?: string, roles?: Role[]) {
        this.badge = badge;
        this.password = password;
        this.id_manager = id_manager!;
        this.firstname = firstname!;
        this.name = name!;
        this.roles = roles!;
    }

}