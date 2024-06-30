import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class AddDataSourceDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @IsEnum(['postgres', 's3'])
  type: string;

  @IsString()
  pgUri: string;

  @IsString()
  s3Bucket: string;

  @IsString()
  s3Region: string;

  @IsString()
  s3Key: string;

  @IsString()
  s3Secret: string;

  @IsString()
  s3Endpoint: string;
}
