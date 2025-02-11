import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TimerModule } from './timer/timer.module';
import { Timer } from './timer/entities/timer.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.NODE_ENV === 'production'
        ? {
            url: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'timer_db',
          }),
      entities: [Timer],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TimerModule,
  ],
})
export class AppModule {}
