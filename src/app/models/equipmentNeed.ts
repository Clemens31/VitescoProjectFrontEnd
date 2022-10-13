import { ComputerModel } from "./computerModel";
import { ComputerType } from "./computerType";
import { Equipment } from "./equipment";

export class EquipmentNeed {
    id_equipmentNeed: number;
    computerType: ComputerType;
    computerModel: ComputerModel;
    machineName: string;
    equipmentList: Equipment[] = [];

    constructor(computerType: ComputerType,
        computerModel: ComputerModel,
        equipmentList?: Equipment[],
        id_equipmentNeed?: number,
        machineName?: string) {
            this.computerType = computerType;
            this.computerModel = computerModel;
            this.equipmentList = equipmentList!;
            this.id_equipmentNeed = id_equipmentNeed!;
            this.machineName = machineName!;
        }
}