export class Pizza {
    constructor(
        public id: string,
        public batchId: string,
        public toppings: string[],
        public preparationStart: Date,
        public preparationEnd?: Date,
    ) {}
}
