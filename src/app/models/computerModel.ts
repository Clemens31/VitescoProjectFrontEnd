export class ComputerModel {
    id_computerModel: number; 
    name: string;

    constructor(name: string, id_computerModel?: number) {
        this.name = name;
        this.id_computerModel = id_computerModel!;
    }
}