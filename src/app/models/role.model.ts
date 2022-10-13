import { RoleEnum } from "./role.enum";

export class Role {
    id_role: number;
    name: RoleEnum;

    constructor(name: RoleEnum) {
        this.name = name;
    }

}

