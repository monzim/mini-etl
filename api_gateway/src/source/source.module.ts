import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SyncModule } from 'src/sync/sync.module';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';

@Module({
  imports: [SyncModule, DatabaseModule],
  controllers: [SourceController],
  providers: [SourceService],
})
export class SourceModule {}
