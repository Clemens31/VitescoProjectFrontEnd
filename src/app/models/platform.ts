import { StatutEnum } from "../enum/StatutEnum";

export class Platform {
    id_platform: number;
    name: string;
    statut: StatutEnum;

    constructor(name: string, id_platform?: number, statut?: StatutEnum) {
        this.name = name;
        this.id_platform = id_platform!;
        this.statut = statut!;
    }
}