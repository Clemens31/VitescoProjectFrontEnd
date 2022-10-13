import { ManagerModel } from "./manager.model";


export class Comment {
    id_comment: number;
    manager: ManagerModel;
    message: String;
    creationDate: Date;

    constructor(message: String, manager: ManagerModel, id_comment?: number, creationDate?: Date) {
            this.message = message;
            this.manager = manager;
            this.id_comment = id_comment!;
            this.creationDate = creationDate!;
        }
}
