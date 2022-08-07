import { UtilService } from './util.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [UtilService],
    exports: [UtilService],
})
export class UtilModule {}
