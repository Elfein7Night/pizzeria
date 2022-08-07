import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PizzasModule } from './pizzas/pizzas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from './app.constants';

@Module({
    imports: [PizzasModule, MongooseModule.forRoot(MONGO_URI)],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
