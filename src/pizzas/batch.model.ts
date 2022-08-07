import { Pizza } from './pizza.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BatchDocument = Batch & Document;
@Schema()
export class Batch {
    @Prop()
    public completed?: Pizza[];

    @Prop()
    public startTime?: Date;

    @Prop()
    public endTime?: Date;

    constructor(public id: string, public batchSize: number) {
        this.completed = [];
        this.startTime = new Date();
    }

    isDone(): boolean {
        return this.completed.length === this.batchSize;
    }
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
