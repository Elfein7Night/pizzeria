import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return [
            '/pizzas            : POST  (submit orders)',
            '/pizzas/batches    : GET   (get completed batches)',
            '/pizzas/active     : GET   (get batches still in progress)',
        ].join('\n');
    }
}
