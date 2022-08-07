import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();

// const orders = [
//     { "toppings": ["bacon", "tomato"] },
//     { "toppings": ["bacon", "tomato", "cheese", "onion"] },
//     { "toppings": ["bacon", "tomato", "cheese", "onion", "mushrooms"] },
//     { "toppings": ["bacon", "tomato", "cheese", "onion", "mushrooms", "pepperoni"] },
//     { "toppings": ["bacon", "tomato", "cheese", "onion", "mushrooms", "pepperoni", "sausage"] }
// ]