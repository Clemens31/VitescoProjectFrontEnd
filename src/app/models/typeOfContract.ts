export class TypeOfContract {
    id_typeOfContract: number;
    name: string;

    constructor(name: string, id_typeOfContract?: number) {
        this.name = name;
        this.id_typeOfContract = id_typeOfContract!;
    }
}