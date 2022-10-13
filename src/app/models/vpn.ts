import { StatutEnum } from "../enum/StatutEnum";
import { YesOrNotEnum } from "../enum/YesOrNotEnum";

export class Vpn {
    id_vpn: number;
    vpn: YesOrNotEnum;
    statut: StatutEnum;
    identifiantVpn: string;

    constructor(
        vpn: YesOrNotEnum,
        id_vpn?: number,
        statut?: StatutEnum,
        identifiantVpn?: string) {
            this.vpn = vpn;
            this.id_vpn = id_vpn!;
            this.statut = statut!;
            this.identifiantVpn = identifiantVpn!;
        }
}