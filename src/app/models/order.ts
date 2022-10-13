export class Order {
    id_order: number;
    order_number: string;
    startOfOrderPeriod: Date | null;
    endOfOrderPeriod: Date | null;

    constructor(
        id_order?: number,
        order_number?: string,
        startOfOrderPeriod?: Date,
        endOfOrderPeriod?: Date) {

        this.id_order = id_order!;
        this.order_number = order_number!;
        this.startOfOrderPeriod = startOfOrderPeriod!;
        this.endOfOrderPeriod = endOfOrderPeriod!;
    }
}