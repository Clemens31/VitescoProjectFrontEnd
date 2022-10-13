import { StatutEnum } from "../enum/StatutEnum";
import { YesOrNotEnum } from "../enum/YesOrNotEnum";

export class Hil {
    id_hil: number;
    hil: YesOrNotEnum;
    reference: string;
    statut: StatutEnum;

    constructor(
        hil: YesOrNotEnum,
        id_hil?: number,
        reference?: string,
        statut?: StatutEnum) {
            this.hil = hil;
            this.id_hil = id_hil!;
            this.reference = reference!;
            this.statut = statut!;
    }

}