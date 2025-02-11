import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';
import { Timer } from './entities/timer.entity';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Timer]), ConfigModule, HttpModule],
  controllers: [TimerController],
  providers: [TimerService],
})
export class TimerModule {}
