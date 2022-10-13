import { DatePipe } from "@angular/common";
import { ifStmt } from "@angular/compiler/src/output/output_ast";
import { Injectable } from "@angular/core";
import { AbstractSubscription } from "../core/subscription";
import { AccountStatusEnum } from "../enum/AccountStatusEnum";
import { ElectronicKeyEnum } from "../enum/ElectronicKeyEnum";
import { RecordingHoursEnum } from "../enum/RecordingHoursEnum";
import { StatutEnum } from "../enum/StatutEnum";
import { TcAccessEnum } from "../enum/TcAccessEnum";
import { YesNoIdkEnum } from "../enum/YesNoIdkEnum";
import { YesOrNotEnum } from "../enum/YesOrNotEnum";
import { AccountStatus } from "../models/accountStatus";
import { Arrival } from "../models/arrival";
import { Company } from "../models/company";
import { ComputerModel } from "../models/computerModel";
import { ComputerType } from "../models/computerType";
import { ElectronicKey } from "../models/electronicKey";
import { Employee } from "../models/employee";
import { Equipment } from "../models/equipment";
import { Hil } from "../models/hil";
import { Order } from "../models/order";
import { PlaceOfActivity } from "../models/placeOfActivity";
import { Platform } from "../models/platform";
import { School } from "../models/school";
import { TcAccess } from "../models/tcAccess";
import { TypeOfContract } from "../models/typeOfContract";
import { Vpn } from "../models/vpn";
import { Constants } from "../utils/constants";

@Injectable()
export class ArrivalUpdateService extends AbstractSubscription {

    /** Additional Information */
    additionalInformations: string[] = [];

    /** List messags Errors */
    errorField: string;

    /** New Arrival */
    newArrival: Arrival;

    constructor(private datePipe: DatePipe) {
        super();
    }

    /* **********************************  */
    /* Check Informations Arrival Employee */
    /* **********************************  */

    /**
     * Check Employee
     * @param arrival 
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

        /* Create object Employee */
        let employee = new Employee(
            firstName.toLowerCase().trim(),
            name.toLowerCase().trim(),
            id_employee,
            badge ? badge.trim().toLowerCase() : undefined
        );
        return employee; 
    }

    /* **********************************  */
    /* Check Informations Arrival Update */
    /* **********************************  */


    /**
     * Check All informations when the Arrival is updated
     * @param form 
     * @param currentArrival 
     */
    checkInformationsArrivalUpdate(form: any, currentArrival: Arrival,
        placeOfActivities: PlaceOfActivity[], typesOfContracts: TypeOfContract[],
        optionFieldFirstAccount: any[]): Arrival {

        /* Clean all errors */
        this.errorField = "";

        /* Create a new Arrival with the all informations before modification */
        this.newArrival = currentArrival;

        /** Check informations Arrival */
        this.newArrival = this.checkUpdateArrival(form, currentArrival, this.newArrival,
            placeOfActivities, typesOfContracts, optionFieldFirstAccount);

        return this.newArrival;
    }

    /**
     * Check all informations about the object Arrival
     * @param form 
     * @param currentArrival 
     * @returns 
     */
    checkUpdateArrival(form: any, currentArrival: Arrival, newArrival: Arrival,
        placeOfActivities: PlaceOfActivity[], typesOfContracts: TypeOfContract[],
        optionFieldFirstAccount: any[]): Arrival {

        /** Date of Entry */
        if(form.dateOfEntry == null) {
            this.errorField = "Error : The field \"Date of entry\" is incorrect";
            throw new Error("CheckUpdateArrival : Error value Date of entry : " + form.dateOfEntry);
        } else {
            newArrival.dateOfEntry = new Date(form.dateOfEntry);
        }

        /** Release Date */
        if(form.releaseDate != null) {
            newArrival.releaseDate = new Date(form.releaseDate);
        }

        /** Place of Activity */
        newArrival = this.checkUpdatePlaceOfActivity(form, currentArrival, placeOfActivities, newArrival);

        /** Type of Contract */
        newArrival = this.checkUpdateTypeOfContract(form, currentArrival, typesOfContracts, newArrival);

        /* OBMS, VTOS */
        if(currentArrival.typeOfContract.name == Constants.EXTERNE.toLowerCase()) {
            newArrival = this.checkObmsAndVtos(form, newArrival);
        }

        /** Responsible */
        if(form.responsible == null || form.responsible.trim() == "") {
            this.errorField = "Error : The field \"Responsible\" is incorrect";
            throw new Error("CheckUpdateArrival : Error value Responsible : " + form.responsible);
        } else {
            newArrival.vtResponsible = form.responsible.trim().toLowerCase();
        }

        /** Cost Center */
        if(form.costCenter == null || form.costCenter.trim() == "") {
            this.errorField = "Error : The field \"Cost Center\" is incorrect";
            throw new Error("CheckUpdateArrival : Error value Cost Center : " + form.costCenter);
        } else {
            newArrival.costCenter = form.costCenter.trim().toLowerCase();
        }

        /** First Account */
        newArrival = this.checkFirstAccount(form, currentArrival, optionFieldFirstAccount, newArrival);

        /** Check office adress */
        if(currentArrival.placeOfActivity.name.toLowerCase() == Constants.SUR_SITE.toLowerCase()) {
            newArrival = this.checkOfficeAdress(form, newArrival);
        }

        return newArrival;
    }

    /**
     * Check all informations about the Place of Activity
     * @param form 
     * @param currentArrival 
     * @param placeOfActivities 
     * @returns 
     */
    checkUpdatePlaceOfActivity(form: any, currentArrival: Arrival, placeOfActivities: PlaceOfActivity[], newArrival: Arrival): Arrival {

        // If Place of Activity is empty
        if(form.placeOfActivity == null) {
            this.errorField = "Error : The field \"Place of Activity\" is incorrect";
            throw new Error("CheckUpdatePlaceOfActivity : Error value Place of Activity : " + form.placeOfActivity);
        }

        // If value is changed
        if(form.placeOfActivity.toLowerCase() != currentArrival.placeOfActivity.name.toLowerCase()) {

            // Loop the list of Place of Activities
            for(let element of placeOfActivities) {

                // Checks the correspondence between the added value and the value of the list
                if(element.name.toLowerCase() == form.placeOfActivity.toLowerCase()) {

                    // If old value was "Site", that add a message for the field "officeAdress"
                    if(currentArrival.placeOfActivity.name.toLowerCase() == Constants.SUR_SITE.toLowerCase()) {
                        this.additionalInformations.push("Office Address");
                    }

                    // Change the value of Place of Activity
                    newArrival.placeOfActivity = element;

                    return newArrival;
                } 
            }
            this.errorField = "Error : The field \"Place of Activity\" is not correct";
            throw new Error("CheckUpdatePlaceOfActivity : Error value Place of Activity : " + form.placeOfActivity);

        }

        // Update the field officeAdress
        newArrival.officeAdress = form.officeAdress ? form.officeAdress.toLowerCase().trim() : null;

        return newArrival;
    }

    /**
     * Check all informations about the Type of contract
     * @param form 
     * @param currentArrival 
     * @param typesOfContracts
     * @returns 
     */
    checkUpdateTypeOfContract(form: any, currentArrival: Arrival, typesOfContracts: TypeOfContract[], newArrival: Arrival): Arrival {

        // If Type of contract is empty
        if(form.typeOfContract == null) {
            this.errorField = "Error : The field \"Type of contract\" is incorrect";
            throw new Error("CheckUpdateTypeOfContract : Error value Type of contract : " + form.typeOfContract);
        }

        // If value is changed
        if(form.typeOfContract.toLowerCase() != currentArrival.typeOfContract.name.toLowerCase()) {

            // Loop the list of Type of Contracts
            for(let typeOfContract of typesOfContracts) {

                // Check the correspondence beetween the added value and the value of the list
                if(typeOfContract.name.toLowerCase() == form.typeOfContract.toLowerCase()) {

                    // If old value was "EXTERNE", that add a message for the field : 
                    //"OBMS", "VTOS", "Order Number", "Start Order", "End Order", "Company", "VPN"
                    if(currentArrival.typeOfContract.name.toLowerCase() == Constants.EXTERNE.toLowerCase()) {
                        this.additionalInformations.push("Obms");
                        this.additionalInformations.push("Vtos");
                        this.additionalInformations.push("Order Number");
                        this.additionalInformations.push("Start Order");
                        this.additionalInformations.push("End Order");
                        this.additionalInformations.push("Company");
                        this.additionalInformations.push("VPN");
                    
                    // If old value was "Internship -3 months", that add a message for the field : 
                    // "School" or "VPN"
                    } else if(currentArrival.typeOfContract.name.toLowerCase() == Constants.STAGE_MOINS_3_MOIS.toLowerCase()) {
                        this.additionalInformations.push("School");
                        this.additionalInformations.push("VPN");

                    // If old value was "Internship +3 months" or "Apprentice", that add a message for the field : 
                    // "School"
                    } else if(currentArrival.typeOfContract.name.toLowerCase() == Constants.STAGE_3_MOIS_ET_PLUS.toLowerCase() || 
                        currentArrival.typeOfContract.name.toLowerCase() == Constants.ALTERNANT.toLowerCase()) {
                        this.additionalInformations.push("School");

                    // If old value was "CDD", "CDI", "EXPAT", that add a message for the field : 
                    // Nothing
                    } else {
                    }

                    // Change the value of Place of Activity
                    newArrival.typeOfContract = typeOfContract;

                    return newArrival;
                }
            }

            this.errorField = "Error : The field \"Place of Activity\" is not correct";
            throw new Error("CheckUpdateTypeOfContract : Error value Place of Activity : " + form.placeOfActivity);

        }

        return currentArrival;
    }

    /**
     * Check OBMS
     * @param form 
     * @param currentArrival 
     * @returns 
     */
    checkObmsAndVtos(form: any, newArrival:Arrival): Arrival{

        newArrival.obms = form.obms ? form.obms.trim().toLowerCase() : null;
        newArrival.vtos = form.vtos ? form.vtos : null;
        return newArrival;
    }

    /**
     * Check First Account
     * @param form 
     * @param currentArrival 
     * @param optionFieldFirstAccount 
     * @returns 
     */
    checkFirstAccount(form: any, currentArrival: Arrival, optionFieldFirstAccount: any[], newArrival: Arrival): Arrival {

         // If First Account is empty
         if(form.firstAccount == null) {
            this.errorField = "Error : The field \"First Account\" is incorrect";
            throw new Error("CheckFirstAccount : Error value First Account : " + form.firstAccount);
        }

        // If value is changed
        if(form.firstAccount.toLowerCase() != currentArrival.firstAccount.toLowerCase()) {
            
            const firstAccountList = Object.values(YesNoIdkEnum);
            const firstAccountKeyList = Object.keys(YesNoIdkEnum) as YesNoIdkEnum[];

            // Loop the list of First Account
            for(let firstAccount of firstAccountList) {

                // Check the correspondence beetween the added value and the value of the list
                if(firstAccount.toLowerCase() == form.firstAccount.toLowerCase()) {

                    newArrival.firstAccount = firstAccountKeyList[firstAccountList.indexOf(firstAccount)];
                    return newArrival;

                }
            }

            this.errorField = "Error : The field \"First Account\" is not correct";
            throw new Error("CheckFirstAccount : Error value First Account : " + form.firstAccount);
        }

        return currentArrival;
    }


   /**
    * Check Office Adress
    * @param form 
    * @param currentArrival 
    * @returns 
    */
   checkOfficeAdress(form: any, newArrival: Arrival): Arrival {

        newArrival.officeAdress = form.officeAdress ? form.officeAdress.trim().toLowerCase() : null;
        return newArrival;
    }

    /* **********************************  */
    /* Check Informations Order Update */
    /* **********************************  */
    checkInformationsOrderUpdate(form: any, currentArrival: Arrival): Arrival {

        let order;

        // If Order exists 
        if(currentArrival.order && currentArrival.order.id_order) {

            // Copy the old value to a new object Order
            order = currentArrival.order;

            /** Order number */
            if(form.orderNumber != currentArrival.order.order_number) {
                order.order_number = form.orderNumber != null && form.orderNumber.trim() != "" ?
                    form.orderNumber.trim().toLowerCase() : 
                    null
            }

            /** Order number */
            if(form.orderNumber != currentArrival.order.order_number) {
                order.order_number = form.orderNumber != null && form.orderNumber.trim() != "" ?
                    form.orderNumber.trim().toLowerCase() : 
                    null
            }

            /* Start of period */
            if(form.startOfOrderPeriod != currentArrival.order.startOfOrderPeriod) {
                order.startOfOrderPeriod = new Date(form.startOfOrderPeriod)
            }

            /* End of period */
            if(form.endOfOrderPeriod != currentArrival.order.endOfOrderPeriod) {
                order.endOfOrderPeriod = new Date(form.endOfOrderPeriod)
            }


        // If Order doesn't exists
        } else {
            order = new Order(null!, null!, null!, null!);

            /** Order number */
            if(form.orderNumber != null && form.orderNumber.trim() != "") {
                order.order_number = form.orderNumber.trim().toLowerCase();
            }

            /* Start of period */
            if(form.startOfOrderPeriod) {
                order.startOfOrderPeriod = new Date(form.startOfOrderPeriod);
            }

            /* End of period */
            if(form.endOfOrderPeriod) {
                order.endOfOrderPeriod = new Date(form.endOfOrderPeriod);
            }
        }

        /** Asign order */
        currentArrival.order = order;

        return currentArrival;

    }


    /* **********************************  */
    /* Check Informations School/Company Update */
    /* **********************************  */
    checkInformationsSchoolCompanyUpdate(form: any, currentArrival: Arrival, 
        selectACategory: string, listSchool: School[], listCompany: Company[]): Arrival {

        let school = form.school && form.school.toLowerCase() != selectACategory.toLowerCase() ? form.school : null;
        let company = form.company && form.company.toLowerCase() != selectACategory.toLowerCase() ? form.company : null;

        /* If School or company is "select a category" */
        if(school == null && company == null) {
            this.errorField = "Error : No modification. No field has been selected";
            throw new Error("checkInformationsSchoolCompanyUpdate : Error : No modification. No field has been selected");
        }

        // Add the school to the object Arrival
        if(school) {
            for(let sc of listSchool) {
                if(school.toLowerCase().trim() == sc.name.toLowerCase().trim()) {
                    currentArrival.school = sc;
                }
            }                                                                                          
        }

        // Add the company to the object Arrival
        if(company) {
            for(let comp of listCompany) {
                if(company.toLowerCase().trim() == comp.name.toLowerCase().trim()) {
                    currentArrival.company = comp;
                }
            } 
        }

        return currentArrival;
    }


    /* **********************************  */
    /* Check Informations Equipments */
    /* **********************************  */
    checkInformationsEquipmentNeed(form: any, currentArrival: Arrival,
        computerModels: ComputerModel[], computerTypes: ComputerType[], equipmentResultList: Equipment[]): Arrival {

        /* ComputerModel */
        this.checkComputerModel(form, currentArrival, computerModels);

        /* Computer Type */
        this.checkComputerType(form, currentArrival, computerTypes);

        /* Name of machine */
        if(form.nameComputer != null && form.nameComputer.trim() != "") {
            currentArrival.equipmentNeed.machineName = form.nameComputer.trim().toLowerCase();
        }

        /* List equipments */
        this.addEquipments(currentArrival, equipmentResultList);

 
        return currentArrival;
    }

    /* Check Computer Model */
    checkComputerModel(form: any, currentArrival: Arrival, computerModels: ComputerModel[]) {

        /* Computer Model */
        if(form.computerModel != null && form.computerModel.trim() != "") {

            // If computer model is on the list
            for(let item of computerModels) {
                
                if(item.name.toUpperCase().trim() == form.computerModel.toUpperCase().trim()) {
                    currentArrival.equipmentNeed.computerModel = item;
                    return currentArrival;
                } 
            }
            this.errorField = "Error : The field \"Computer Model\" is not correct";
            throw new Error("CheckComputerModel : Error value ComputerModel : " + form.computerModel);
        }
        return currentArrival;
    }

    /* Check Computer Type */
    checkComputerType(form: any, currentArrival: Arrival, computerTypes: ComputerType[]) {

        /* Computer Type */
        if(form.computerType != null && form.computerType.trim() != "") {

            // If Computer Type is on the list
            for(let item of computerTypes) {
                
                if(item.name.toUpperCase().trim() == form.computerType.toUpperCase().trim()) {
                    currentArrival.equipmentNeed.computerType = item;
                    return currentArrival;
                } 
            }
            this.errorField = "Error : The field \"Computer Type\" is not correct";
            throw new Error("CheckComputerType : Error value Computer Type : " + form.computerType);
        }
        return currentArrival;
    }

    /* Add list Equipments */
    addEquipments(currentArrival: Arrival, equipmentResultList: Equipment[]) {

        /* Clean the old list */
        currentArrival.equipmentNeed.equipmentList = [];

        /* If list is not empty */
        if(equipmentResultList != null) {
            
            // Loop on the list and add the equipment
            equipmentResultList.forEach(element => {
                currentArrival.equipmentNeed.equipmentList.push(element);
            });
            
        } 

        return currentArrival;
    }

    /* **********************************  */
    /* Check Informations Rights - SHD/SHF */
    /* **********************************  */
    checkInformationsRights(form: any, currentArrival: Arrival, selectACategory: string, 
        optionListPlatform: Platform[]) {

        let newArrival = currentArrival;
        
        // VPN
        newArrival = this.checkVpn(form, currentArrival, newArrival, selectACategory);
        
        // Account Statut
        newArrival = this.checkAccountStatut(form, currentArrival, newArrival, selectACategory);

        // Tc Access
        newArrival = this.checkTcAccess(form, currentArrival, newArrival);

        // Platform
        newArrival = this.checkPlatform(form, currentArrival, newArrival, optionListPlatform);

        // Hil Access
        newArrival = this.checkHilAccess(form, currentArrival, newArrival);

        // RecordingHours 
        newArrival = this.checkRecordingHours(form, currentArrival, newArrival, selectACategory);

        // Check Electronickey and ID Electronickey
        newArrival = this.checkElectronickey(form, currentArrival, newArrival, selectACategory);

        return newArrival;
    }

    /** Check VPN and ID VPN */
    checkVpn(form: any, currentArrival: Arrival, newArrival: Arrival, selectACategory: string): Arrival{

        // If type of contract is externe or stage less 3 months
        if(currentArrival.typeOfContract.name.toLowerCase() == Constants.EXTERNE.toLowerCase() || 
            currentArrival.typeOfContract.name.toLowerCase() == Constants.STAGE_MOINS_3_MOIS.toLowerCase()) {

            // If current Arrival has not VPN
            if(currentArrival.vpn == null || currentArrival.vpn.vpn == null) {

                // If form is completed and differente from the old value
                if(form.vpn) {

                    // If choice is select a category
                    if(form.vpn.toLowerCase() == selectACategory.toLowerCase()) {
                        this.errorField = "Error : The field VPN is not selected.";
                        throw new Error("CheckVpn : Error value VPN : " + form.vpn);
                    }

                    const vpnList = Object.values(YesOrNotEnum);
                    for(let key of vpnList ) {
                        if(form.vpn.toLowerCase() == key.toLowerCase()) {
                            form.vpn = vpnList.indexOf(key);
                            let vpn = new Vpn(form.vpn);
                            newArrival.vpn = vpn;
                            break;
                        }
                    }

                }

            
            } // If current Arrival has already a VPN
            else if (currentArrival.vpn != null && form.vpn != null && 
                currentArrival.vpn.vpn.toLowerCase() != form.vpn.toLowerCase()) {

                // If choice is select a category
                if(form.vpn.toLowerCase() == selectACategory.toLowerCase()) {
                    this.errorField = "Error : The field VPN is not selected.";
                    throw new Error("CheckVpn : Error value VPN : " + form.vpn);
                }

                const vpnList = Object.values(YesOrNotEnum);
                for(let key of vpnList ) {
                    if(form.vpn.toLowerCase() == key.toLowerCase()) {
                        form.vpn = vpnList.indexOf(key);
                        let vpn = new Vpn(form.vpn);
                        newArrival.vpn = vpn;
                        break;
                    }
                }
            }

            // ID VPN
            if(!form.vpn && currentArrival.vpn == null && form.idVpn && form.idVpn.trim() != " ") {
                this.errorField = "Error : The field ID VPN is not correct. You can't save the ID VPN without select the VPN";
                throw new Error("CheckVpn : Error value ID VPN : " + form.idVpn);

                // If only update idVPN with VPN no change
            } else if (currentArrival.vpn) {
                newArrival.vpn.identifiantVpn = 
                form.idVpn && form.idVpn.trim().toLowerCase() ? form.idVpn.trim().toLowerCase() : null;

                // If VPN is change and idVPN
            } else if(form.vpn && form.idVpn && form.idVpn.trim() != " ") {
                newArrival.vpn.identifiantVpn = form.idVpn.trim().toLowerCase();
   
            } 

        }

        return newArrival;
    }

    /** Check Account Statut */
    checkAccountStatut(form: any, currentArrival: Arrival, newArrival: Arrival, selectACategory: string): Arrival {

        // If not empty and different
        if(form.accountStatus != null && currentArrival.accountStatus &&
            form.accountStatus.toLowerCase() != currentArrival.accountStatus.accountStatus) {

            // If not select a category 
            if(form.accountStatus.toLowerCase() == selectACategory.toLowerCase()) {
                this.errorField = "Error : The field Account status is not selected.";
                throw new Error("CheckAccountStatut : Error value Account status : " + form.accountStatus);
            }

            const accountStatusList = Object.values(AccountStatusEnum);
            for(let key of accountStatusList ) {

                if(form.accountStatus.toLowerCase() == key.toLowerCase()) {

                    form.accountStatus = accountStatusList.indexOf(key);
                    let accountStatus = new AccountStatus(
                        form.accountStatus, null!, null!
                    );
                    newArrival.accountStatus = accountStatus;

                    return newArrival;
                }
            }

        // Is not empty but object doesn't exist already
        } else if (form.accountStatus != null && currentArrival.accountStatus == null) {

            // If not select a category 
            if(form.accountStatus.toLowerCase() == selectACategory.toLowerCase()) {
                this.errorField = "Error : The field Account status is not selected.";
                throw new Error("CheckAccountStatut : Error value Account status : " + form.accountStatus);
            }

            const accountStatusList = Object.values(AccountStatusEnum);
            for(let key of accountStatusList ) {

                if(form.accountStatus.toLowerCase() == key.toLowerCase()) {

                    form.accountStatus = accountStatusList.indexOf(key);
                    let accountStatus = new AccountStatus(
                        form.accountStatus, null!, null!
                    );
                    newArrival.accountStatus = accountStatus;

                    return newArrival;
                }
            }

        }

        return newArrival;
    }

    /** Check Tc Access */
    checkTcAccess(form: any, currentArrival: Arrival, newArrival: Arrival): Arrival {

        // If not empty and different
        if(form.tcAccess != null && form.tcAccess.toLowerCase() != currentArrival.tcAccess.tcAccess) {

            const tcAccessList = Object.values(TcAccessEnum);
            for(let key of tcAccessList ) {

                if(form.tcAccess.toLowerCase() == key.toLowerCase()) {

                    form.tcAccess = tcAccessList.indexOf(key);
                    let tcAccess = new TcAccess(
                        form.tcAccess, null!, null!
                    );
                    newArrival.tcAccess = tcAccess;

                    return newArrival;
                }
            }
        }
        return newArrival;

    }

    /** Check Platform */
    checkPlatform(form: any, currentArrival: Arrival, newArrival: Arrival, optionListPlatform: Platform[]): Arrival {

        // If value and platform different
        if(form.platform != null && form.platform.toLowerCase() != currentArrival.platform.name.toLowerCase()) {

            // Loop list Platform
            for(let pl of optionListPlatform) {
                
                if(pl.name.toLowerCase() == form.platform.toLowerCase()) {
                    let platform = new Platform(pl.name);
                    newArrival.platform = platform;
                }
            }
        }

        return newArrival;
    }   

    /** Check Hil Access */
    checkHilAccess(form: any, currentArrival: Arrival, newArrival: Arrival): Arrival {

        // If value and hil different
        if(form.hil != null && form.hil.toLowerCase() != currentArrival.hil.hil.toLowerCase()) {
            
            const hilList = Object.values(YesOrNotEnum);
            for(let key of hilList ) {

                if(form.hil.toLowerCase() == key.toLowerCase()) {
                    form.hil = hilList.indexOf(key);

                    let hil = new Hil(form.hil);
                    newArrival.hil = hil;
                    break;
                }
            }
        }

        return newArrival;
    }

    /** Check Recording Hours */
    checkRecordingHours(form: any, currentArrival: Arrival, newArrival: Arrival, selectACategory: String): Arrival {

        // If value and recordingHours different
        if(form.recordingHours != null && form.recordingHours != undefined) {

            // If not select a category 
            if(form.recordingHours.toLowerCase() == selectACategory.toLowerCase()) {
                this.errorField = "Error : The field RecordingHours is not selected.";
                throw new Error("CheckRecordingHours : Error value RecordingHours : " + form.recordingHours);
            }
            
            const recordingHoursList = Object.values(RecordingHoursEnum);

            for(let key of recordingHoursList ) {
                if(form.recordingHours.toLowerCase() == key.toLowerCase()) {
                    form.recordingHours = recordingHoursList.indexOf(key);
                    newArrival.recordingHours = form.recordingHours;
                    break;
                }
            }

        } else if (form.recordingHours != null && form.recordingHours != undefined && 
            form.recordingHours.toLowerCase() != currentArrival.recordingHours.toLowerCase()) {

            // If not select a category 
            if(form.recordingHours.toLowerCase() == selectACategory.toLowerCase()) {
                this.errorField = "Error : The field RecordingHours is not selected.";
                throw new Error("CheckRecordingHours : Error value RecordingHours : " + form.recordingHours);
            }
                
            const recordingHoursKeysList = Object.keys(RecordingHoursEnum);
            const recordingHoursList = Object.values(RecordingHoursEnum);
            
            for(let key of recordingHoursList ) {
                
                if(form.recordingHours.toLowerCase() == key.toLowerCase()) {
                    
                    form.recordingHours = recordingHoursKeysList.indexOf(key);
                    newArrival.recordingHours = form.recordingHours;
                    
                }
            }

        }

        return newArrival;
    }

    /** Check Electronickey and ID Electronickey */
    checkElectronickey(form: any, currentArrival: Arrival, newArrival: Arrival, selectACategory: String): Arrival {

        // If location is added whitout electronicKey value
        if(form.electronicKey == null && form.location != null && form.location.trim() != " " && 
            currentArrival.electronicKey == null) {
                this.errorField = "Error : The field electronicKey is incorrect. You cannot add an location identifier without choosing an electronic key";
                throw new Error("CheckElectronickey : Error value electronicKey : " + form.electronicKey);
        } 

        // If location is added whitout electronicKey value and different with the old value
        if(form.location != null && form.location.trim() != " " && 
            form.electronicKey == selectACategory) {
                this.errorField = "Error : The field electronicKey is not selected.";
                throw new Error("CheckElectronickey : Error value electronicKey : " + form.electronicKey);
        }

        // If electronickey exists already, update Electronickey and location
        if(form.electronicKey && currentArrival.electronicKey && currentArrival.electronicKey.electronicKeyEnum) {

            const optionElectronicKey = Object.values(ElectronicKeyEnum);

            // loop list enum
            for(let ele of optionElectronicKey) {

                // If correct
                if(ele.toLowerCase() == form.electronicKey.toLowerCase()) {

                    form.electronicKey = optionElectronicKey.indexOf(ele);
                    let electronicKey = new ElectronicKey(
                        currentArrival.electronicKey.id_electronicKey, 
                        form.electronicKey,
                        null!,
                        null!)
                    newArrival.electronicKey = electronicKey;

                    // Clean Location
                    if(form.location != null) {

                        newArrival.electronicKey.location = 
                        form.location.trim().toLowerCase() ? form.location.trim().toLowerCase() : null;
                    }
                    break;
                }
            }
        }

        // If electronickey exists already, update location
        if(currentArrival.electronicKey && currentArrival.electronicKey.electronicKeyEnum) {
            
            // Update location
            newArrival.electronicKey.location = 
            form.location && form.location.trim().toLowerCase() ?  form.location.trim().toLowerCase() : null;
            
        }

        // If electronickey not exists
        if(form.electronicKey && currentArrival.electronicKey == null) {

            const optionElectronicKey = Object.values(ElectronicKeyEnum);

            // loop list enum
            for(let ele of optionElectronicKey) {

                // If correct
                if(ele.toLowerCase() == form.electronicKey.toLowerCase()) {
                    form.electronicKey = optionElectronicKey.indexOf(ele);

                    let electronicKey = new ElectronicKey(
                        null!,
                        form.electronicKey,
                        null!,
                        null!)
                    newArrival.electronicKey = electronicKey;

                    // Clean Location
                    newArrival.electronicKey.location = 
                    form.location && form.location.trim().toLowerCase() ?  form.location.trim().toLowerCase() : null;
                    break;
                }
            }
        }


        return newArrival;
    }

    /* **********************************  */
    /* Check Informations Rights - First Section */
    /* **********************************  */
    checkInformationRightsFirstSection(form: any, currentArrival: Arrival, selectACategory: string) {

        let newArrival = currentArrival;

        newArrival = this.checkStatutTcAccess(form, currentArrival, newArrival, selectACategory);
        newArrival = this.checkElectronickeyStatutAndId(form, currentArrival, newArrival, selectACategory);

        return newArrival;

    }

    /**
     * Check Statut Tc Access
     * @param form 
     * @param currentArrival 
     * @param newArrival 
     * @param selectACategory 
     * @returns 
     */
    checkStatutTcAccess(form: any, currentArrival: Arrival, newArrival: Arrival, selectACategory: string): Arrival {

        if(form.tcAccess) {

            // If select a category
            if(form.tcAccess.toLowerCase() == selectACategory.toLowerCase()) {
                this.errorField = "Error : The field Statut is not selected.";
                throw new Error("CheckStatutTcAccess : Error value statut : " + form.tcAccess);
            }

            // List of Enum
            const statutEnumKeyList = Object.keys(StatutEnum);
            const statutEnumList = Object.values(StatutEnum);

            for(let statut of statutEnumList) {

                // If statut exists already
                if(form.tcAccess.toLowerCase() == statut.toLowerCase()) {
                    form.tcAccess = statutEnumKeyList[statutEnumList.indexOf(statut)];
                    newArrival.tcAccess.statut = form.tcAccess;
                    break;
                } 
            }

        }

        return newArrival;
    }

    checkElectronickeyStatutAndId(form: any, currentArrival: Arrival, newArrival: Arrival, selectACategory: string): Arrival {

        // ID
        let identifiant;
        if(form.id == null || form.id.toLowerCase().trim() == "") {
            identifiant = null;
        } else {
            identifiant = form.id.toLowerCase().trim()
        }
        newArrival.electronicKey.identifiant = identifiant;
        
        // Electronickey
        if(form.statutElectronicKey) {

            const statutEnumKeyList = Object.keys(StatutEnum);
            const statutEnumList = Object.values(StatutEnum);

            // Loop enum with response
            for(let statut of statutEnumList) {

                // If select a category
                if(form.statutElectronicKey.toLowerCase() == selectACategory.toLowerCase()) {
                    this.errorField = "Error : The field Statut is not selected.";
                    throw new Error("CheckStatutTcAccess : Error value statut : " + form.statutElectronicKey);
                }

                if(statut.toLowerCase() == form.statutElectronicKey.toLowerCase()) {
                    form.statutElectronicKey = statutEnumKeyList[statutEnumList.indexOf(statut)];
                    newArrival.electronicKey.statut = form.statutElectronicKey;
                }
            }
        }

        return newArrival;
    }

    /* **********************************  */
    /* Check Informations Rights - Second Section */
    /* **********************************  */
    checkInformationRightsSecondSection(form: any, currentArrival: Arrival, selectACategory: string, hilString: string): Arrival {

        let newArrival = currentArrival;

        newArrival = this.checkStatutHil(form, currentArrival, newArrival, selectACategory);
        newArrival = this.checkReferenceHil(form, currentArrival, newArrival, selectACategory, hilString);

        return newArrival;
    }

    checkStatutHil(form: any, currentArrival: Arrival, newArrival: Arrival, selectACategory: string): Arrival {
        
        if(form.statut) {

            // If select a category
            if(form.statut.toLowerCase() == selectACategory.toLowerCase()) {
                this.errorField = "Error : The field Statut is not selected.";
                throw new Error("CheckStatutHil : Error value statut : " + form.statut);
            }

            // List of Enum
            const statutEnumKeyList = Object.keys(StatutEnum);
            const statutEnumList = Object.values(StatutEnum);

            for(let st of statutEnumList) {

                // If statut exists already
                if(form.statut.toLowerCase() == st.toLowerCase()) {
                    form.statut = statutEnumKeyList[statutEnumList.indexOf(st)];
                    newArrival.hil.statut = form.statut;
                    break;
                } 
            }

        }

        return newArrival;
    }

    checkReferenceHil(form: any, currentArrival: Arrival, newArrival: Arrival, selectACategory: string, hilString: string): Arrival {

        if(form.reference && !hilString) {
            this.errorField = "Error : The field reference is not correct. The Hil access need to be true";
            throw new Error("CheckReferenceHil : Error value statut : " + form.reference);
        }

        // Update the reference field
        if(form.reference || currentArrival.hil.reference) {
            form.reference = form.reference.toLowerCase().trim();
            newArrival.hil.reference = form.reference;    
        }

        return newArrival;
    }

}