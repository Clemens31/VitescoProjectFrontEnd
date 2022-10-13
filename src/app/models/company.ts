export class Company {
    id_company: number;
    name: string;
    expiry_date_prevention_plan: Date;
    archived: boolean;

    constructor(name: string, id_company?: number,
        expiry_date_prevention_plan?: Date, archived?: boolean) {
            this.name = name;
            this.id_company = id_company!;
            this.expiry_date_prevention_plan = expiry_date_prevention_plan!;
            this.archived = archived!;
    }
}