import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Pizza } from './pizza.model';
import { Batch, BatchDocument } from './batch.model';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { v1 as uuidv1 } from 'uuid';
import {
    BATCH_COMPLETE,
    MAX_ACTIVE_FOR_STATION,
    NEXT_STATION,
    Station,
    TASK_COMPLETE,
    TASK_IN_QUEUE,
    TIME_FOR_STATION_MS,
} from './pizzas.constants';
import { UtilService } from 'src/util/util.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PizzasService {
    /**
     * We use Event-driven design (EDD) to manage the pipeline.
     * We could have used Promise Chaining or Promise Queues but EDD is much more efficient.
     * We could have also used some external State Machines libraries to implement the EDD but that's overkill for this size of project.
     * (although we did some small version of state machine with the transitions between the stations).
     * Also, events are easier to test and debug.
     * @param eventEmitter EventEmitter2 injected instance of NestJS EventEmitter
     * @param utilService UtilService injected instance of UtilService
     * @param batchModel Model<BatchDocument> injected instance of BatchModel
     */
    constructor(
        // dependency injections
        private eventEmitter: EventEmitter2,
        private utilService: UtilService,
        @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
    ) {}

    // *************************************************************
    // *********************** FIELDS ******************************
    // *************************************************************
    private queues: { [key in Station]: Pizza[] } = {
        [Station.DOUGH]: [],
        [Station.TOPPING]: [],
        [Station.OVEN]: [],
        [Station.WAITER]: [],
    };

    private busyCount: { [key in Station]: number } = {
        [Station.DOUGH]: 0,
        [Station.TOPPING]: 0,
        [Station.OVEN]: 0,
        [Station.WAITER]: 0,
    };

    private batchesInProgress: { [batchId: string]: Batch } = {};

    // strictly for reporting back to the client, has nothing to do the logic
    private inStationInfo: { [key in Station]: Set<Pizza> } = {
        [Station.DOUGH]: new Set<Pizza>(),
        [Station.TOPPING]: new Set<Pizza>(),
        [Station.OVEN]: new Set<Pizza>(),
        [Station.WAITER]: new Set<Pizza>(),
    };

    // *************************************************************
    // ******************* EVENT HANDLING **************************
    // *************************************************************
    private emitInQueue(station: Station) {
        this.eventEmitter.emit(TASK_IN_QUEUE, station);
    }

    private emitTaskComplete(station: Station, pizza: Pizza) {
        this.eventEmitter.emit(TASK_COMPLETE, station, pizza);
    }

    private emitBatchComplete(batchId: string) {
        this.eventEmitter.emit(BATCH_COMPLETE, batchId);
    }

    @OnEvent(TASK_IN_QUEUE)
    onTaskInQueue(station: Station) {
        if (
            this.busyCount[station] >= MAX_ACTIVE_FOR_STATION[station] ||
            this.queues[station].length == 0
        ) {
            return;
        }

        this.busyCount[station]++;
        let station_time = TIME_FOR_STATION_MS[station];

        if (station == Station.TOPPING) {
            // no more toppings to put on the pizza
            if (this.queues[station][0].pendingToppings.length == 0) {
                this.busyCount[station]--;
                this.emitTaskComplete(station, this.queues[station].shift());
                return;
            }

            // a tricky part of the logic: each chef can handle 2 toppings at a time
            station_time *= Math.min(
                2,
                this.queues[station][0].pendingToppings.splice(-2).length,
            );

            if (this.queues[station][0].pendingToppings.length != 0) {
                // there are more toppigs left, call for help from other chefs
                this.emitInQueue(station);
            }
        }

        const pizza =
            station != Station.TOPPING
                ? this.queues[station].shift()
                : this.queues[station][0];

        if (
            station != Station.TOPPING ||
            pizza.toppings.length == pizza.pendingToppings.length
        ) {
            console.log(
                `${new Date()} : pizza #${
                    pizza.id
                } is in the ${station} station`,
            );
        }

        this.inStationInfo[station].add(pizza);

        // schedule timeout for task completion, once it's done, emit `task complete` event
        setTimeout(() => {
            this.busyCount[station]--;
            if (station != Station.TOPPING) {
                this.emitTaskComplete(station, pizza);
            } else {
                this.emitInQueue(station); // didn't finish toppings, it is still in toppings queue
            }
        }, station_time);
    }

    @OnEvent(TASK_COMPLETE)
    onTaskComplete(station: Station, pizza: Pizza) {
        this.inStationInfo[station].delete(pizza);

        console.log(
            `${new Date()} : pizza #${pizza.id} left the ${station} station`,
        );

        if (!(station in NEXT_STATION)) {
            // Pizza done all stations
            pizza.preparationEnd = new Date();
            this.batchesInProgress[pizza.batchId].completed.push(pizza);
            if (this.batchesInProgress[pizza.batchId].isDone()) {
                // Done all pizzas in this batch
                this.emitBatchComplete(pizza.batchId);
            }
        } else {
            this.queues[NEXT_STATION[station]].push(pizza);
            this.emitInQueue(NEXT_STATION[station]);
            if (this.queues[station].length !== 0) {
                this.emitInQueue(station);
            }
        }
    }

    @OnEvent(BATCH_COMPLETE)
    onBatchComplete(batchId: string) {
        const doneTime = new Date();
        console.log(`${doneTime} : Batch #${batchId} is done`);
        this.batchesInProgress[batchId].endTime = doneTime;

        // print a report about the complete set of orders
        console.log('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        const timeTookForBatch = this.utilService.getTimeElapsedInSeconds(
            this.batchesInProgress[batchId].startTime,
            this.batchesInProgress[batchId].endTime,
        );
        console.log(
            `Batch #${batchId} took ${timeTookForBatch} seconds to complete`,
        );
        this.batchesInProgress[batchId].completed.forEach((pizza: Pizza) => {
            const timeTookForPizza = this.utilService.getTimeElapsedInSeconds(
                pizza.preparationStart,
                pizza.preparationEnd,
            );

            console.log(
                `\tpizza #${pizza.id} took ${timeTookForPizza} seconds to complete`,
            );
            console.log(`\t\ttoppings : ${pizza.toppings.join(', ')}\n`);
        });
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');

        // save batch ('orders set report') to the database
        this.batchModel.create(this.batchesInProgress[batchId]).then(
            () => {
                console.log(`Batch #${batchId} saved to database`);
                delete this.batchesInProgress[batchId];
            },
            (err) => {
                console.log(err);
            },
        );
    }

    // *************************************************************
    // ******************* SERVICE METHODS *************************
    // *************************************************************
    addOrdersBatch(orders: { toppings: string[] }[]) {
        if (orders.length === 0) {
            throw new HttpException(
                'No orders provided',
                HttpStatus.BAD_REQUEST,
            );
        }

        const batchId = uuidv1().slice(4, 8);
        this.batchesInProgress[batchId] = new Batch(batchId, orders.length);
        console.log(`${new Date()} : Batch #${batchId} started...`);

        orders.forEach((order) => {
            this.queues[Station.DOUGH].push(
                new Pizza(
                    uuidv1().slice(4, 8),
                    batchId,
                    order.toppings,
                    new Date(),
                ),
            );
            this.emitInQueue(Station.DOUGH);
        });
    }

    async getAllBatches(): Promise<object[]> {
        const batches = await this.batchModel.find().exec();
        return batches.map((batch: Batch) => ({
            id: batch.id,
            startTime: batch.startTime,
            endTime: batch.endTime,
            completed: batch.completed,
        }));
    }

    getAllBatchesInProgress(): { [key: string]: object } {
        const inStationInfo = { ...this.inStationInfo };
        for (const station in inStationInfo) {
            inStationInfo[station] = Array.from(inStationInfo[station]);
        }

        return {
            queues: { ...this.queues },
            inStationInfo: inStationInfo,
        };
    }

    async saveBatch(batch: Batch): Promise<Batch> {
        return this.batchModel.create(batch);
    }
}
