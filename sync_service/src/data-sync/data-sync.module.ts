import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DataSyncService } from './data-sync.service';
import { GithubService } from './github.service';

@Module({
  imports: [DatabaseModule],
  providers: [DataSyncService, GithubService],
  exports: [DataSyncService],
})
export class DataSyncModule {}
