export class Employee {
    firstname: string;
    name: string;   
    id_employee: number;
    badge: string;

    constructor(firstname: string, name: string, id_employee?: number, badge?: string) {
        this.firstname = firstname;
        this.name = name;
        this.id_employee = id_employee!;
        this.badge = badge!;
    }
}