import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSyncService } from 'src/data-sync/data-sync.service';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly dataSync: DataSyncService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async autoSyncPerHour() {
    this.logger.log('Schedule sync started');
    const users = await this.prisma.users.findMany({
      select: {
        id: true,
      },
    });

    for (const user of users) {
      this.dataSync.syncData(user.id);
    }

    this.logger.log('Schedule sync finished');
  }
}
