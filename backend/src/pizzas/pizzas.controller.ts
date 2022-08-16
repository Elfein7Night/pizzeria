import { Controller, Post, Body, Get } from '@nestjs/common';
import { PizzasService } from './pizzas.service';

@Controller('pizzas')
export class PizzasController {
    // dependency injection
    constructor(private readonly pizzasService: PizzasService) {}

    @Post()
    addOrdersBatch(@Body() pizzas: { toppings: string[] }[]) {
        return this.pizzasService.addOrdersBatch(pizzas);
    }

    @Get('batches')
    getAllBatches(): Promise<object[]> {
        return this.pizzasService.getAllBatches();
    }

    @Get('active')
    getActiveBatches(): { [key: string]: object } {
        return this.pizzasService.getAllBatchesInProgress();
    }
}
