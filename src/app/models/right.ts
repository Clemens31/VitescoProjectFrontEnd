import { RightsEnum } from "../enum/RightsEnum";
import { StatutEnum } from "../enum/StatutEnum";

export class Right {
    id_right: number;
    name: RightsEnum;
    isSelected: boolean;
    referenceUser: string;
    statut: StatutEnum;
    numberTicket: string;

    constructor(id_right?: number, name?: RightsEnum,
        isSelected?: boolean, referenceUser?: string,
        statut?: StatutEnum, numberTicket?: string) {
            this.id_right = id_right!;
            this.name = name!;
            this.isSelected = isSelected!;
            this.referenceUser = referenceUser!;
            this.statut = statut!;
            this.numberTicket = numberTicket!;
        }
}