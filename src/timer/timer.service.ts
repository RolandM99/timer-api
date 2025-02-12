import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timer } from './entities/timer.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TimerService {
  constructor(
    @InjectRepository(Timer)
    private timerRepository: Repository<Timer>,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private async notifyMake(event: string, timerData: any) {
    const webhookUrl = this.configService.get('MAKE_WEBHOOK_URL');
    try {
      await this.httpService.post(webhookUrl, {
        event,
        ...timerData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to notify Make platform:', error);
    }
  }

  private formatDuration(milliseconds: number): string {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours > 0
      ? `${hours}h${minutes.toString().padStart(2, '0')}`
      : `${minutes}min`;
  }

  async startTimer(): Promise<Timer> {
    const timer = new Timer();
    const savedTimer = await this.timerRepository.save(timer);

    await this.notifyMake('timer.started', {
      timerId: savedTimer.id,
      startTime: savedTimer.startTime,
    });

    return savedTimer;
  }

  async stopTimer(id: number): Promise<Timer> {
    const timer = await this.timerRepository.findOne({ where: { id } });

    if (!timer) {
      throw new NotFoundException(`Timer with ID ${id} not found`);
    }

    if (timer.endTime) {
      throw new Error('Timer has already been stopped');
    }

    timer.endTime = new Date();
    const durationMs = timer.endTime.getTime() - timer.startTime.getTime();
    timer.duration = durationMs;
    timer.formattedDuration = this.formatDuration(durationMs);

    const savedTimer = await this.timerRepository.save(timer);

    await this.notifyMake('timer.stopped', {
      timerId: savedTimer.id,
      startTime: savedTimer.startTime,
      endTime: savedTimer.endTime,
      duration: savedTimer.duration,
      formattedDuration: savedTimer.formattedDuration,
    });

    return savedTimer;
  }
}
