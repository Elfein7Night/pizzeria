import { Module } from '@nestjs/common';
import { PizzasController } from './pizzas.controller';
import { PizzasService } from './pizzas.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UtilModule } from '../util/util.module';

@Module({
    imports: [EventEmitterModule.forRoot(), UtilModule], // enable dependency injection for event emitter
    controllers: [PizzasController],
    providers: [PizzasService],
})
export class PizzasModule {}
