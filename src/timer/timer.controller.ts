import { Controller, Post, Param, ParseIntPipe, Get } from '@nestjs/common';
import { TimerService } from './timer.service';
import { Timer } from './entities/timer.entity';

@Controller('api/timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get('/health')
  getHealth() {
    return { status: 'ok' };
  }

  @Post('start')
  startTimer(): Promise<Timer> {
    return this.timerService.startTimer();
  }

  @Post('stop/:id')
  stopTimer(@Param('id', ParseIntPipe) id: number): Promise<Timer> {
    return this.timerService.stopTimer(id);
  }
}
