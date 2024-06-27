import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // autoSyncPerHour() {
  //   this.logger.log(new Date().toISOString());
  // }
}
