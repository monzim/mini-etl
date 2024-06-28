import { IsEnum } from 'class-validator';
import { SourceType } from './connected-source.dto';

export class SyncQueryDto {
  @IsEnum(SourceType)
  scope: SourceType;
}
