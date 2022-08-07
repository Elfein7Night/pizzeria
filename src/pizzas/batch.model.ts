import { Pizza } from './pizza.model';

export class Batch {
    constructor(
        public id: string,
        public batchSize: number,
        public completed?: Pizza[],
        public startTime?: Date,
        public endTime?: Date,
    ) {
        this.completed = [];
        this.startTime = new Date();
    }

    isDone(): boolean {
        return this.completed.length === this.batchSize;
    }
}
