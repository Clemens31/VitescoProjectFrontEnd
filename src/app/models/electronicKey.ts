import { ElectronicKeyEnum } from "../enum/ElectronicKeyEnum";
import { StatutEnum } from "../enum/StatutEnum";

export class ElectronicKey  {
    id_electronicKey: number;
    electronicKeyEnum: ElectronicKeyEnum;
    identifiant: string;
    location: string;
    statut: StatutEnum

    constructor(id_electronicKey?: number, electronicKeyEnum?: ElectronicKeyEnum,
        identifiant?: string, location?: string, statut?: StatutEnum) {
            this.id_electronicKey = id_electronicKey!;
            this.location = location!
            this.electronicKeyEnum = electronicKeyEnum!;
            this.identifiant = identifiant!;
            this.statut = statut!;
        }
}