import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  Length,
} from 'class-validator';

enum SourceType {
  PUBLIC_REPO = 'PUBLIC_REPO',
  PULL_REQUESTS = 'PULL_REQUESTS',
  ISSUES = 'ISSUES',
}

export class ConnectedSourceDto {
  @IsNotEmpty()
  @Length(1, 36)
  data_source_id: string;
  @IsNotEmpty()
  @Length(1, 36)
  provider_id: string;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ArrayUnique()
  @IsEnum(SourceType, { each: true })
  scopes: SourceType[];
}
