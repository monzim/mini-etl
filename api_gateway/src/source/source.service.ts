import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/database/prisma.service';
import { SyncService } from 'src/sync/sync.service';
import { AuthUser } from 'src/types/AuthUser';
import { AddDataSourceDto } from './dto/add-data-source.dto';

@Injectable()
export class SourceService {
  constructor(
    private sync: SyncService,
    private prisma: PrismaService,
  ) {}

  getAllDataSources(user: AuthUser) {
    return this.prisma.dataSources.findMany({
      where: { user_id: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addDataToSource(userId: string, payload: AddDataSourceDto) {
    const k = await this.prisma.dataSources.create({
      data: {
        name: payload.name,
        type: payload.type === 's3' ? 'S3' : 'POSTGRES',
        pgUrl: payload.pgUri,
        s3Bucket: payload.s3Bucket,
        s3Region: payload.s3Region,
        s3Key: payload.s3Key,
        s3Secret: payload.s3Secret,
        user_id: userId,
      },
    });

    this.sync.queue.emit('new_connection', {
      userId,
      dataSources: k.id,
    });

    return k;
  }
}
