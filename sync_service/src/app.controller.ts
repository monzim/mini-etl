import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ConnectedSourceDto } from './dto/connected-source.dto';
import { NewConnectionDto } from './dto/new-connection.dto';
import { SyncNowDto } from './dto/sync-now.dto';
import { SyncQueryDto } from './dto/sync-query.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('sync_now')
  handleSyncNow(@Payload() data: SyncNowDto) {
    this.appService.handleSyncNow(data);
  }

  @EventPattern('new_data_connection')
  handleNewConnection(@Payload() data: ConnectedSourceDto) {
    this.appService.handleNewConnection(data);
  }

  @EventPattern('new_data_source')
  handleNewDataSource(@Payload() data: NewConnectionDto) {
    this.appService.handleNewDataSource(data);
  }

  @MessagePattern('get_sync_data')
  getSyncData(@Payload() data: SyncQueryDto) {
    return this.appService.getSyncData(data);
  }
}
