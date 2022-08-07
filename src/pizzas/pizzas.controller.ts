import { Controller, Post, Body } from '@nestjs/common';
import { PizzasService } from './pizzas.service';

@Controller('pizzas')
export class PizzasController {
    // dependency injection
    constructor(private readonly pizzasService: PizzasService) {}

    @Post()
    addOrdersBatch(@Body() pizzas: { toppings: string[] }[]) {
        return this.pizzasService.addOrdersBatch(pizzas);
    }
}
