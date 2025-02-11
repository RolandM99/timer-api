import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimerModule } from './timer/timer.module';
import { Timer } from './timer/entities/timer.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'timer_db',
      entities: [Timer],
      synchronize: true,
    }),
    TimerModule,
  ],
})
export class AppModule {}
