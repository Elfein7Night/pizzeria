import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Pizza {
    @Prop()
    public toppings: string[];

    @Prop()
    public preparationStart: Date;

    @Prop()
    public preparationEnd?: Date;

    public pendingToppings: string[];

    constructor(
        public id: string,
        public batchId: string,
        toppings: string[],
        preparationStart: Date,
    ) {
        this.preparationStart = preparationStart;
        this.toppings = toppings;
        this.pendingToppings = toppings.slice();
    }
}

export const PizzaSchema = SchemaFactory.createForClass(Pizza);
