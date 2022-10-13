export class Equipment {
    id_equipment: number;
    name: string;
    attributed: boolean;
    recovered: boolean;
    archived: boolean;

    constructor(name: string, attributed: boolean,
        id_equipment?: number, recovered?: boolean,
        archived?: boolean) {
            this.name = name;
            this.attributed = attributed;
            this.id_equipment = id_equipment!;
            this.recovered = recovered!;
            this.archived = archived!;
        }
}