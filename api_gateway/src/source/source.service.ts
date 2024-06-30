import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SyncService } from 'src/sync/sync.service';
import { AuthUser } from 'src/types/AuthUser';
import { AddDataSourceDto } from './dto/add-data-source.dto';
import { ConnectedSourceDto } from './dto/connected-source.dto';
import { SyncQueryDto } from './dto/sync-query.dto';

@Injectable()
export class SourceService {
  constructor(
    private sync: SyncService,
    private prisma: PrismaService,
  ) {}

  async getSyncData(
    user: AuthUser,
    connection_id: string,
    query: SyncQueryDto,
  ) {
    const dataConnection = await this.prisma.dataSourceConnections.findUnique({
      where: { id: connection_id },
      include: {
        dataSource: true,
      },
    });

    if (!dataConnection) {
      throw new NotFoundException(
        `Data source connection not found with ID ${connection_id}`,
      );
    }

    if (dataConnection.dataSource.user_id !== user.id) {
      throw new UnauthorizedException(
        `You do not have access to this data source connection`,
      );
    }

    return this.sync.queue.send('get_sync_data', {
      connection_id: dataConnection.id,
      query: query.scope,
    });
  }

  getAllConnections(user: AuthUser) {
    return this.prisma.dataSourceConnections.findMany({
      where: {
        dataSource: {
          user_id: user.id,
        },
      },
      include: {
        dataSource: {
          select: {
            name: true,
            type: true,
          },
        },
        provider: {
          select: {
            type: true,
          },
        },
      },
      orderBy: {
        lastSyncAt: 'desc',
      },
    });
  }

  syncNow(user: AuthUser) {
    this.sync.queue.emit('sync_now', {
      user_id: user.id,
    });
  }

  async connectToSource(user: AuthUser, payload: ConnectedSourceDto) {
    const dataSources = await this.prisma.dataSources.findUnique({
      where: { id: payload.data_source_id },
    });

    if (!dataSources) {
      throw new NotFoundException('Data source not found with that ID');
    }

    if (dataSources.user_id !== user.id) {
      throw new UnauthorizedException(
        'You do not have access to this data source',
      );
    }

    if (dataSources.lastConnectionCheck && dataSources.connected === false) {
      throw new BadRequestException(
        'Data source is not connected so cannot sync. Please check your connection.',
      );
    }

    const provider = await this.prisma.providers.findUnique({
      where: { id: payload.provider_id },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found with that ID');
    }

    if (provider.user_id !== user.id) {
      throw new UnauthorizedException(
        'You do not have access to this provider',
      );
    }

    const join = await this.prisma.dataSourceConnections.create({
      data: {
        provider_id: payload.provider_id,
        dataSource_id: payload.data_source_id,
        scopes: payload.scopes,
      },
    });

    this.sync.queue.emit('new_data_connection', {
      user_id: user.id,
      join_id: join.id,
    });

    return join;
  }

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
        s3Endpoint: payload.s3Endpoint,
        user_id: userId,
      },
    });

    this.sync.queue.emit('new_data_source', {
      userId,
      connection_id: k.id,
    });

    return k;
  }
}
