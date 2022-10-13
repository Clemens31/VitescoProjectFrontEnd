export class School {
    id_school: number;
    name: string;
    expiry_date_prevention_plan: Date;
    archived: boolean;

    constructor(name: string, id_school?: number, expiry_date_prevention_plan?: Date, archived?: boolean) {
        this.name = name;
        this.id_school = id_school!;
        this.expiry_date_prevention_plan = expiry_date_prevention_plan!;
        this.archived = archived!;
    }
}