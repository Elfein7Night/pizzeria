import { Module } from '@nestjs/common';
import { PizzasController } from './pizzas.controller';
import { PizzasService } from './pizzas.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UtilModule } from '../util/util.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Batch, BatchSchema } from './batch.model';

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        UtilModule,
        MongooseModule.forFeature([{ name: Batch.name, schema: BatchSchema }]),
    ], // enable dependency injection for event emitter
    controllers: [PizzasController],
    providers: [PizzasService],
})
export class PizzasModule {}
