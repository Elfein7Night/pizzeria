import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PizzasModule } from './pizzas/pizzas.module';

@Module({
    imports: [PizzasModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
