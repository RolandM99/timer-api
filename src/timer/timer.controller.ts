import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { TimerService } from './timer.service';
import { Timer } from './entities/timer.entity';

@Controller('api/timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Post('start')
  startTimer(): Promise<Timer> {
    return this.timerService.startTimer();
  }

  @Post('stop/:id')
  stopTimer(@Param('id', ParseIntPipe) id: number): Promise<Timer> {
    return this.timerService.stopTimer(id);
  }
}
