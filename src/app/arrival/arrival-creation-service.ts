import { Injectable } from "@angular/core";
import { AbstractSubscription } from "src/app/core/subscription";
import { Constants } from "src/app/utils/constants";
import { AccountStatusEnum } from "../enum/AccountStatusEnum";
import { ElectronicKeyEnum } from "../enum/ElectronicKeyEnum";
import { RecordingHoursEnum } from "../enum/RecordingHoursEnum";
import { RightsEnum } from "../enum/RightsEnum";
import { TcAccessEnum } from "../enum/TcAccessEnum";
import { YesNoIdkEnum } from "../enum/YesNoIdkEnum";
import { YesOrNotEnum } from "../enum/YesOrNotEnum";
import { AuthService } from "../manager/authentification/auth.service";
import { AccountStatus } from "../models/accountStatus";
import { Arrival } from "../models/arrival";
import { Comment } from "../models/comment";
import { Company } from "../models/company";
import { ComputerModel } from "../models/computerModel";
import { ComputerType } from "../models/computerType";
import { ElectronicKey } from "../models/electronicKey";
import { Employee } from "../models/employee";
import { Equipment } from "../models/equipment";
import { EquipmentNeed } from "../models/equipmentNeed";
import { Hil } from "../models/hil";
import { Order } from "../models/order";
import { PlaceOfActivity } from "../models/placeOfActivity";
import { Platform } from "../models/platform";
import { Right } from "../models/right";
import { School } from "../models/school";
import { TcAccess } from "../models/tcAccess";
import { TypeOfContract } from "../models/typeOfContract";
import { Vpn } from "../models/vpn";


@Injectable()
export class ArrivalCreationService extends AbstractSubscription {

    /** List messages Errors */
    errorField : string;

    constructor(
        private authService: AuthService) { 
            super()
        }

    /* **********************************  */
    /* Check Informations  */
    /* **********************************  */
    checkInformations(form: any, formEquipment: any, equipmentList: Equipment[], 
        computerModelList : ComputerModel[], computerTypeList : ComputerType[],
        placeOfActivities : PlaceOfActivity[], typesOfContracts: TypeOfContract[],
        schoolList: School[], companyList: Company[], platforms: Platform[], 
        selectACategory: string) {

        /* Clean all errors */
        this.errorField = "";

        /* Check Employee */
        let employee = this.checkEmployee(form.firstName, form.name);

        /* Check Place of Activity */
        let placeOfActivity = this.checkPlaceOfActivity(form, placeOfActivities, selectACategory);

        /* Check Type of Contract */
        let typeOfContract = this.checkTypeOfContract(form, typesOfContracts, selectACategory);

        /* Check Order */
        let order;
        if(form.order && form.order.trim()) {
            order = this.checkOrder(form);
        }

        /* Check School */
        let school;
        if(form.school != null)  {
            school = this.checkSchool(form.school, schoolList, selectACategory);
        }

        /* Check Company */
        let company;
        if(form.company != null)  {
            company = this.checkCompany(form.company, companyList, selectACategory);
        }

        /* Check EquipmentNeed */
        let equipmentNeed = this.checkEquipmentNeed(form, formEquipment, equipmentList, 
            computerModelList, computerTypeList);

        /* Check Comment */
        let comment;
        if(form.comments && form.comments.trim() && form.comments.trim() != "") {
            comment = this.checkComment(form.comments);
        }

        /* Check Platform */
        let platform = this.checkPlatform(form.platform, platforms, selectACategory);

        /* Check Account Status */
        let accountStatus = this.checkAccountStatus(form.accountStatus, selectACategory);

        /* Check Tc Access */
        let tcAccess = this.checkTcAccess(form, selectACategory);

        /* Check Electronic Key */
        let electronicKey;
        if(form.electronicKey != null && form.electronicKey.trim() != null && form.electronicKey.trim() != "") {
            electronicKey = this.checkElectronicKey(form, selectACategory);
        }

        /* Check Hil */
        let hil = this.checkHil(form, selectACategory);

        /* Check VPN */
        let vpn = this.checkVpn(form.vpn, selectACategory);
        
        /* Check Rights */
        let rights = this.checkRights(form)

        /* Check Arrival */
        let arrival = this.checkArrival(selectACategory, form, employee, placeOfActivity, 
            typeOfContract, equipmentNeed, platform, 
            tcAccess, order, school, company, comment, 
            accountStatus, electronicKey, hil, rights, vpn);
        return arrival;

    }

    /**
     * Check Employee
     * @param firstName 
     * @param name 
     * @param id_employee 
     * @param badge 
     * @returns 
     */
    checkEmployee(firstName: string, name: string, id_employee?: number, badge? : String) : Employee {

        /* Check name */
        if(name == null || name.trim() == "") {
            this.errorField = "Error : The field \"Name\" is incorrect";
            throw new Error("CheckEmployee : Error value name : " + name);
        }

        /* Check firstname */
        if(firstName == null || firstName.trim() == "") {
            this.errorField = "Error : The field \"Firstname\" is incorrect";
            throw new Error("CheckEmployee : Error value firstname : " + firstName);
        }

        /* Check badge */
        if(badge != null && badge.trim() != null && badge.trim() != "") {
            badge = badge.trim().toLowerCase();
        }

        /* Create object Employee */
        let employee = new Employee(
            firstName.toLowerCase().trim(),
            name.toLowerCase().trim(),
            id_employee,
            badge?.toLowerCase().trim()
        );
        return employee; 
    }

    /**
     * Check Place of Activity
     * @param value 
     * @param placeOfActivities 
     * @returns PlaceOfActivity
     */
    checkPlaceOfActivity(form: any, placeOfActivities: PlaceOfActivity[], selectACategory: String) : PlaceOfActivity {

        if(form.placeOfActivity.toLowerCase() == selectACategory.toLowerCase()) {
            this.errorField = "Error : The field \"Place of Activity\" is not selected";
            throw new Error("CheckCompany : Error value Company : " + form.placeOfActivity);
        }

        for(let element of placeOfActivities) {
            if(element.name.toLowerCase() == form.placeOfActivity.toLowerCase()) {

                // Clean other field
                if(element.name.toLowerCase() != Constants.SUR_SITE.toLowerCase()) {
                    form.officeAdress = null;
                }
                return element;
            } 
        }
        this.errorField = "Error : The field \"Place of activity\" is incorrect";
        throw new Error("CheckPlaceOfActivity : Error value PlaceOfActivity : " + form.placeOfActivity);
    }


    /**
     * Check Type of Contract
     * @param value 
     * @param typesOfContracts 
     * @returns TypeOfContract
     */
    checkTypeOfContract(form: any, typesOfContracts: TypeOfContract[], selectACategory: String) : TypeOfContract {

        if(form.typeOfContract.toLowerCase() == selectACategory.toLowerCase()) {
            this.errorField = "Error : The field \"Type of Contract\" is not selected";
            throw new Error("CheckCompany : Error value Company : " + form.typeOfContract);
        }

        for(let element of typesOfContracts) {
            if(element.name.toLowerCase() == form.typeOfContract.toLowerCase()) {

                /* Clean fields about the type of contract */
                this.cleanFielTypeOfContract(form);
                return element;
            } 
        }
        this.errorField = "Error : The field \"Type of contract\" is incorrect";
        throw new Error("CheckTypeOfContract : Error value TypeOfContract : " + form.typeOfContract);
    }

    /**
     * 
     * @param form 
     */
    cleanFielTypeOfContract(form: any) {

        /* If type of contract is EXTERNE */
        if(form.typeOfContract.toLowerCase() == Constants.EXTERNE.toLowerCase()) {
            form.school = null;
            if(form.obms && form.obms.trim() != null && form.obms != "" ) {
                form.obms = form.obms.trim().toLowerCase();
            }
        }

        /* If type of contract is CDD || CDI || Expat */
        if(form.typeOfContract.toLowerCase() == Constants.CDD.toLowerCase() ||
        form.typeOfContract.toLowerCase() == Constants.CDI.toLowerCase() ||
        form.typeOfContract.toLowerCase() == Constants.EXPAT.toLowerCase()) {
            form.obms = null;
            form.vtos = null;
            form.order = null;
            form.company = null;
            form.school = null;
            form.vpn = null;
        }

        /* If type of contract is Internship 3 MONTHS AND MORE || ALTERNANT */
        if(form.typeOfContract.toLowerCase() == Constants.STAGE_3_MOIS_ET_PLUS.toLowerCase() ||
        form.typeOfContract.toLowerCase() == Constants.ALTERNANT.toLowerCase()) {
            form.obms = null;
            form.vtos = null;
            form.order = null;
            form.company = null;
            form.vpn = null;
        }

        /* If type of contract is Internship - 3 MONTHS */
        if(form.typeOfContract.toLowerCase() == Constants.STAGE_MOINS_3_MOIS.toLowerCase()) {
            form.obms = null;
            form.vtos = null;
            form.order = null;
            form.company = null;
        }

    }

    /**
     * Check Order
     * @param value 
     * @returns 
     */
    checkOrder(value: any) : Order {

        let order = new Order(
            null!,
            value.order ? value.order!.trim().toLowerCase() : null,
            value.startOfOrderPeriod ? value.startOfOrderPeriod : null,
            value.endOfOrderPeriod ? value.endOfOrderPeriod : null
        );
        return order;
    } 

    /**
     * Check School
     * @param value 
     * @param schoolList 
     * @returns 
     */
    checkSchool(value: string, schoolList: School[], selectACategory: string) : School {

        if(value.toLowerCase() == selectACategory.toLowerCase()) {
            this.errorField = "Error : The field \"School\" is not selected";
            throw new Error("CheckSchool : Error value School : " + value);
        }

        for(let school of schoolList) {
            if(school.name.toLowerCase() == value.toLowerCase()) {
                return school;
            }
        }
        this.errorField = "Error : The field \"School\" is incorrect";
        throw new Error("CheckSchool : Error value School : " + value);
    }
    
    /**
     * 
     * @param value Check Company
     * @param companyList 
     * @returns 
     */
    checkCompany(value: string, companyList: Company[], selectACategory: string) {

        if(value.toLowerCase() == selectACategory.toLowerCase()) {
            this.errorField = "Error : The field \"Company\" is not selected";
            throw new Error("CheckCompany : Error value Company : " + value);
        }

        for(let company of companyList) {
            if(company.name.toLowerCase() == value.toLowerCase()) {
                return company;
            }
        }
        this.errorField = "Error : The field \"Company\" is incorrect";
        throw new Error("CheckCompany : Error value Company : " + value);
    }

    /**
     * Check Equipment Need
     * @param value 
     * @param equipmentsAdded 
     * @param initListEquipment 
     * @returns 
     */
    checkEquipmentNeed(value: any, equipmentsAdded: any, initListEquipment : Equipment[], 
        computerModelList : ComputerModel[], computerTypeList : ComputerType[]) : EquipmentNeed {
        
        /* Computer Type and Computer Model */
        let computerType = this.checkComputerType(value.computerType, computerTypeList);
        let computerModel = this.checkComputerModel(value.computerModel, computerModelList);
        let listResultEquipments : Equipment[] = [];

        /* If equipments exists */
        if(equipmentsAdded != null) {
            
            /* 1. Cast all equipments in object Equipment */
            let listTemp : Equipment[] = [];
            for(let element of equipmentsAdded) {
                listTemp.push(new Equipment(element.toLowerCase().trim(), false)); // TODO attributed
            } 
            
            /* 2. Loop all elements added then coompare with the list of equipments already saved in the database */
            for(let element of equipmentsAdded) {

                /* Loop to compare with the initial list */
                for(let el of initListEquipment) {

                    /* Add in result object if the resultat added is selected from the init list */
                    if(el.name.toLowerCase() == element.toLowerCase()) {
                        listResultEquipments.push(el);
                    }
                }
            }

            /* If element is Other equipment added */
            let otherEquipment = listTemp.filter(function (equipment) {
                return !initListEquipment.some(function (e) {
                    return equipment.name === e.name
               });
            });

            /* Add other equipment in list or result */
            for(let element of otherEquipment) {
                listResultEquipments.push(element);
            }

        }

        return new EquipmentNeed(computerType, computerModel, listResultEquipments);
    }

    /**
     * Check Computer Type
     * @param value 
     * @param computerTypeList 
     * @returns 
     */
    checkComputerType(value: string, computerTypeList : ComputerType[]) : ComputerType {

        if(value == null || value.trim() == null || value.trim() == "") {
            this.errorField = "Error : The field ComputerType is empty";
            throw new Error("CheckComputerType : Error value ComputerType : " + value);
        }

        for(let element of computerTypeList) {
            if(element.name.toLowerCase().trim() == value.toLowerCase().trim() && element.id_computerType != null) {
                return element;
            }
        }
        this.errorField = "Error : The field ComputerType isn't correct";
        throw new Error("CheckComputerType : Error value ComputerType : " + value);
    }

    /**
     * Computer Model
     * @param value 
     * @param computerModelList 
     * @returns 
     */
    checkComputerModel(value: any, computerModelList : ComputerModel[]) : ComputerModel{

        if(value == null || value.trim() == null || value.trim() == "") {
            this.errorField = "Error : The field ComputerPower is empty";
            throw new Error("CheckComputerModel : Error value ComputerModel : " + value);
        }

        for(let element of computerModelList) {
            if(element.name.toLowerCase().trim() == value.toLowerCase().trim() && element.id_computerModel != null) {
                return element;
            }
        }
        this.errorField = "Error : The field ComputerPower isn't correct";
        throw new Error("CheckComputerModel : Error value ComputerModel : " + value);
    }

    /**
     * Check Comment
     * @param value 
     * @returns 
     */
    checkComment(value: string) {
        let comment = [];
        comment.push(new Comment(value.toLowerCase().trim(), this.authService.currentManager));
        return comment;
    }

    /**
     * Check Platform
     * @param value 
     * @param platforms 
     * @returns Platform
     */
    checkPlatform(value: any, platforms: Platform[], selectACategory: String) : Platform{

        if(value.toLowerCase() == selectACategory.toLowerCase()) {
            this.errorField = "Error : The field \"Platform\" is not selected";
            throw new Error("CheckCompany : Error value Company : " + value);
        }

        for(let element of platforms) {
            if(element.name.toLowerCase() == value.toLowerCase()) {
                return element;
            } 
        }
        this.errorField = "Error : The field \"Platform\" is incorrect";
        throw new Error("checkPlatform : Error value Platform : " + value);
    }

    /**
     * Check Account Status
     * @param value 
     * @param selectACategory 
     * @returns 
     */
    checkAccountStatus(value: any, selectACategory: String) {

        console.log(value);

        /* Account Status */
        if(value != null && isNaN(value)) {

            /* If a choice is selected but no selection from the list */
            if(value.toLowerCase() == selectACategory.toLowerCase()) {
                value = null;
            }

            if(value != null) {
                
                const accountStatusList = Object.values(AccountStatusEnum);
                for(let key of accountStatusList ) {
                    if(value.toLowerCase() == key.toLowerCase()) {
                        value = accountStatusList.indexOf(key);
                        let accountStatus = new AccountStatus(
                            value, null!, null!
                        );
                        return accountStatus;
                    }
                }
            }
        }
        return value;
    }

    /**
     * Check Tc Access
     * @param value 
     * @param selectACategory 
     * @returns 
     */
    checkTcAccess(value : any, selectACategory: String): TcAccess {
           
        /* TC Access */            
        if(value.tcAccess != null) {

            if(isNaN(value.tcAccess)) { // Exit Bug when account status selected "select a category" 

                /* If a choice is selected but no selection from the list */
                if(value.tcAccess.toLowerCase() == selectACategory.toLowerCase()) {
                    this.errorField = "Error : The field \"TC Access\" is not selected";
                    throw new Error("CheckTcAccess : Error value TC Access : " + value);
                }

                const tcAccessList = Object.values(TcAccessEnum);
                for(let key of tcAccessList ) {
                    if(value.tcAccess.toLowerCase() == key.toLowerCase()) {
                        value.tcAccess = tcAccessList.indexOf(key);

                        // Create object Tc Access
                        let tcAccess = new TcAccess(value.tcAccess);
                        return tcAccess;
                    }
                }
            }

            // Create object Tc Access - if bug and return index
            let tcAccess = new TcAccess(value.tcAccess);
            return tcAccess;

        } else {
            this.errorField = "Error : The field \"TC Access\" is incorrect";
            throw new Error("CheckTcAccess : Error value TC Access : " + value);
        }
    }

    /**
     * Check Electronic Key
     * @param value 
     * @returns 
     */
    checkElectronicKey(value: any, selectACategory: string) {

        /* If first account is select a category */
        if(value.electronicKey.toLowerCase() == selectACategory.toLowerCase()) {
            value.electronicKey = null;
            value.location = null;
            return value.electronicKey;
        }

        /* Electronic key value */
        if(value.electronicKey != null) {
            const electronicKeyList = Object.values(ElectronicKeyEnum);
            const electronicKeyListUpperCase = Object.keys(ElectronicKeyEnum);

            /* Match Search */
            for(let element of electronicKeyList) {
                if(element.toLowerCase() == value.electronicKey.toLowerCase()) {

                    /* Cast to enum the value electronicKey */
                    for(let el of electronicKeyListUpperCase) {
                        if(electronicKeyListUpperCase.indexOf(el) == electronicKeyList.indexOf(element)) {
                            value.electronicKey = el;
                        }
                    }

                    /** Location */
                    if(value.location || value.location.trim() == "") {
                        value.location = value.location.trim();
                    } else {
                        value.location = null;
                    }

                    /* Create object */
                    let eK = new ElectronicKey(
                        null!,
                        value.electronicKey!,
                        null!,
                        value.location ? value.location : null
                    );
                    
                    return eK;
                } 
            }
        }
    }

    /**
     * Check Hil
     * @param value 
     * @param selectACategory 
     * @returns 
     */
    checkHil(value: any, selectACategory: string) : Hil{
        
        /* Laboratory Access */
        if(value.hil != null && isNaN(value.hil)) {

            /* If a choice is selected but no selection from the list */
            if(value.hil.toLowerCase() == selectACategory.toLowerCase()) {
                this.errorField = "Error : The field \"Laboratory Access\" is not selected";
                throw new Error("CheckHil : Error value Laboratory Access : " + value);
            }

            const labAccessList = Object.values(YesOrNotEnum);
            for(let key of labAccessList ) {
                if(value.hil.toLowerCase() == key.toLowerCase()) {
                    value.hil = labAccessList.indexOf(key);
                    break;
                }
            }
            return new Hil(value.hil);

            // If bug happend (return number)
        } else if (value.hil != null && !isNaN(value.hil)) {
            return new Hil(value.hil);

        } else {
            this.errorField = "Error : The field \"Laboratory Access - Hil\" is incorrect";
            throw new Error("CheckHil : Error value Laboratory Access - Hil : " + value);
        }

    }

    /**
     * Check Vpn
     * @param value 
     * @param selectACategory 
     * @returns 
     */
    checkVpn(value: any, selectACategory: string): Vpn {

        /* VPN */
        if(value != null && isNaN(value)) {

            /* If a choice is selected but no selection from the list */
            if(value.toLowerCase() == selectACategory.toLowerCase()) {
                value = null;
            }

            if(value != null) {
                const vpnList = Object.values(YesOrNotEnum);
                for(let key of vpnList ) {
                    if(value.toLowerCase() == key.toLowerCase()) {
                        value = vpnList.indexOf(key);
                        let vpn = new Vpn(value);
                        return vpn;
                    }
                }
            }
        }
        return value;
    }

    /**
     * Check Rights
     * @param value 
     * @returns 
     */
    checkRights(value: any) {

        let rights = [];
        const rightsEnum = Object.keys(RightsEnum);

            if(value.add) {
                rights.push(this.createRight(rightsEnum[0]));
            }
            if(value.limas) {

                /** Clean value referenceUser */
                if(value.referenceUser && value.referenceUser.trim() != "") {
                    value.reference = value.referenceUser.toLowerCase().trim();
                } else {
                    value.reference = null;
                }
                rights.push(this.createRight(rightsEnum[1], value.reference));
            }
            if(value.ims) {
                rights.push(this.createRight(rightsEnum[2]));
            }

        return rights;
        
    }

    /**
     * Create object Rights
     * @param rightSelected 
     * @param referenceUser 
     * @returns 
     */
    createRight(rightSelected?: any, referenceUser?: string) {
        let right = new Right(null!, rightSelected!, true, referenceUser!);
        return right;
    }


    /**
     * Check Arrival
     * @param value 
     * @param employee 
     * @param placeOfActivity 
     * @param typeOfContract 
     * @param equipmentNeed 
     * @param platforms 
     * @returns 
     */
    checkArrival(selectACategory: string, value: any, employee: Employee, placeOfActivity: PlaceOfActivity, 
        typeOfContract: TypeOfContract, equipmentNeed: EquipmentNeed, platforms: Platform,
        tcAccess: TcAccess, order?: Order, school? : School, company? : Company, comment? : Comment[], 
        accountStatus?: AccountStatus, electronicKey?: ElectronicKey, hil?: Hil, rights? : Right[], vpn?: Vpn) : Arrival {

            /* VT Responsible */
            if(value.responsible == null || value.responsible.trim() == "" || value.responsible.trim() == "") {
                this.errorField = "Error : The field \"Responsible\" is incorrect";
                throw new Error("CheckArrival : Error value Responsible : " + value);
            } else {
                value.responsible = value.responsible.toLowerCase().trim();
            }

            /* Cost Center */
            if(value.costCenter == null || value.costCenter.trim() == "" || value.costCenter.trim() == "") {
                this.errorField = "Error : The field \"Cost center\" is incorrect";
                throw new Error("CheckArrival : Error value Cost center : " + value);
            } else {
                value.costCenter = value.costCenter.toLowerCase().trim();
            }

            /* First Account */
            /* If a choice is selected but no selection from the list */
            if(value.firstAccount != null) {
                if(isNaN(value.firstAccount) && // Exit Bug when account status selected "select a category" 
                value.firstAccount.toLowerCase() == selectACategory.toLowerCase()) {
                    this.errorField = "Error : The field \"First Account\" is not selected";
                    throw new Error("CheckArrival : Error value First Account : " + value);
                }
                const firstAccountList = Object.values(YesNoIdkEnum);

                if(isNaN(value.firstAccount)) {
                    for(let key of firstAccountList ) {
                        if(value.firstAccount.toLowerCase() == key.toLowerCase()) {
                            value.firstAccount = firstAccountList.indexOf(key);
                            break;
                        }
                    }
                }
                
            } else {
                this.errorField = "Error : The field \"First Account\" is incorrect";
                throw new Error("CheckArrival : Error value First Account : " + value);
            }


            /* Office Adress */
            if(value.officeAdress != null && 
                value.officeAdress.trim() != null && 
                value.officeAdress.trim() != "") {
                value.officeAdress = value.officeAdress.trim().toLowerCase();
            }

            /* Recording Hours */
            if(value.recordingHours != null && isNaN(value.recordingHours)) {

                /* If a choice is selected but no selection from the list */
                if(value.recordingHours.toLowerCase() == selectACategory.toLowerCase()) {
                    value.recordingHours = null;
                } 

                if(value.recordingHours != null) {
                    const recordingHoursList = Object.values(RecordingHoursEnum)
                    for(let key of recordingHoursList ) {
                        if(value.recordingHours.toLowerCase() == key.toLowerCase()) {
                            value.recordingHours = recordingHoursList.indexOf(key);
                            break;
                        }
                    }
                }
                
            } 


        let arrival = new Arrival(
            value.dateOfEntry, 
            value.responsible,
            value.costCenter,
            value.firstAccount,
            tcAccess,
            false,
            employee,
            placeOfActivity,
            typeOfContract,
            equipmentNeed,
            platforms,
            hil!,
            this.authService.currentManager,
            undefined,
            undefined,
            value.releaseDate,
            value.obms!,
            value.vtos!,
            value.officeAdress!,
            accountStatus!,
            value.recordingHours!,
            vpn!,
            order!,
            school!,
            company!,
            comment!,
            electronicKey!,
            rights!
            );

        return arrival;
    }


}