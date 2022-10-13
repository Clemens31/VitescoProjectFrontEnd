export class PlaceOfActivity {
    id_placeOfActivity: number;
    name: string;

    constructor(name: string, id_placeOfActivity?: number) {
        this.name = name;
        this.id_placeOfActivity = id_placeOfActivity!;
    }
}