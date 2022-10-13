import { StatutEnum } from "../enum/StatutEnum";
import { TcAccessEnum } from "../enum/TcAccessEnum";

export class TcAccess {
    id_tcAccess: number;
    tcAccess: TcAccessEnum;
    statut : StatutEnum;

    constructor(
        tcAccess: TcAccessEnum,
        id_tcAccess?: number,
        statut? : StatutEnum) {
            this.tcAccess = tcAccess;
            this.id_tcAccess = id_tcAccess!;
            this.statut = statut!;
    }
}