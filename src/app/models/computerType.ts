export class ComputerType {
    id_computerType: number;
    name: string;

    constructor(name: string, id_computerType?: number,) {
        this.name = name;
        this.id_computerType = id_computerType!;
    }
}