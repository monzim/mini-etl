import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSyncModule } from './data-sync/data-sync.module';
import { DatabaseModule } from './database/database.module';
import { TasksService } from './tasks/tasks.service';
import { PgSetupService } from './pg-setup/pg-setup.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    DataSyncModule,
  ],
  controllers: [AppController],
  providers: [AppService, TasksService, PgSetupService],
})
export class AppModule {}
