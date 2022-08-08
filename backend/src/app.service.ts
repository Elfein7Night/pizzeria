import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Navigate to /pizzas for the Pizza API.';
    }
}
