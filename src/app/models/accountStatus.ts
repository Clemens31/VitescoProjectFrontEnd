import { AccountStatusEnum } from "../enum/AccountStatusEnum";

export class AccountStatus {
    id_accountStatus: number;
    accountStatus: AccountStatusEnum;
    reference: string;

    constructor(
        accountStatus: AccountStatusEnum,
        id_accountStatus?: number,
        reference?: string) {

            this.accountStatus = accountStatus;
            this.id_accountStatus = id_accountStatus!;
            this.reference = reference!;
    }

}