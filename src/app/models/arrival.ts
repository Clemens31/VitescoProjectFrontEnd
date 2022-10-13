
import { AccountStatusEnum } from "../enum/AccountStatusEnum";
import { RecordingHoursEnum } from "../enum/RecordingHoursEnum";
import { TcAccessEnum } from "../enum/TcAccessEnum";
import { YesNoIdkEnum } from "../enum/YesNoIdkEnum";
import { YesOrNotEnum } from "../enum/YesOrNotEnum";
import { Company } from "./company";
import { Employee } from "./employee";
import { EquipmentNeed } from "./equipmentNeed";
import { Order } from "./order";
import { PlaceOfActivity } from "./placeOfActivity";
import { School } from "./school";
import { Comment } from "./comment";
import { Platform } from "./platform";
import { ElectronicKey } from "./electronicKey";
import { Right } from "./right";
import { ManagerModel } from "./manager.model";
import { TypeOfContract } from "./typeOfContract";
import { TcAccess } from "./tcAccess";
import { Hil } from "./hil";
import { AccountStatus } from "./accountStatus";
import { Vpn } from "./vpn";

export class Arrival {
    id_arrival: number;
    creationDate: Date;
    dateOfEntry: Date;
    releaseDate: Date;
    obms: string;
    vtos: number;
    vtResponsible: string;
    costCenter: string;
    firstAccount: YesNoIdkEnum;
    officeAdress: string;
    recordingHours: RecordingHoursEnum;
    isFullyRegistry : boolean;

    // Relations 
    employee: Employee;
    placeOfActivity: PlaceOfActivity;
    typeOfContract: TypeOfContract;
    order: Order;
    school: School;
    company: Company;
    equipmentNeed: EquipmentNeed;
    commentList: Comment[] = [];
    platform: Platform;
    accountStatus: AccountStatus;
    tcAccess: TcAccess;
    electronicKey: ElectronicKey;
    hil: Hil;
    vpn: Vpn;
    rightList: Right[];
    manager: ManagerModel;

    constructor(
        dateOfEntry: Date,
        vtResponsible: string,
        costCenter: string,
        firstAccount: YesNoIdkEnum,
        tcAccess: TcAccess,
        isFullyRegistry : boolean,
        employee: Employee,
        placeOfActivity: PlaceOfActivity,
        typeOfContract: TypeOfContract,
        equipmentNeed: EquipmentNeed,
        platform: Platform,
        hil: Hil,
        manager: ManagerModel,
        id_arrival?: number,
        creationDate?: Date,
        releaseDate?: Date,
        obms?: string,
        vtos?: number,
        officeAdress?: string,
        accountStatus?: AccountStatus,
        recordingHours?: RecordingHoursEnum,
        vpn?: Vpn,
        order?: Order,
        school?: School,
        company?: Company,
        commentList?: Comment[],
        electronicKey?: ElectronicKey,
        rightList?: Right[],
        ) {
            this.dateOfEntry = dateOfEntry;
            this.vtResponsible = vtResponsible;
            this.costCenter = costCenter;
            this.firstAccount = firstAccount;
            this.tcAccess = tcAccess; // Relation
            this.hil = hil;
            this.isFullyRegistry = isFullyRegistry;

            // Optionnel
            this.id_arrival = id_arrival!;
            this.creationDate = creationDate!;
            this.releaseDate = releaseDate!;
            this.obms = obms!;
            this.vtos = vtos!;
            this.officeAdress = officeAdress!;
            this.accountStatus = accountStatus!;
            this.recordingHours = recordingHours!;
            this.vpn = vpn!;

            // Relations
            this.employee = employee;
            this.placeOfActivity = placeOfActivity;
            this.typeOfContract = typeOfContract;
            this.equipmentNeed = equipmentNeed;
            this.platform = platform;
            this.manager = manager;

            // Optionnel
            this.order = order!;
            this.company = company!;
            this.school = school!;
            this.commentList = commentList!;
            this.electronicKey = electronicKey!;
            this.rightList = rightList!;
    }

}