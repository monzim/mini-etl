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
  @Length(3, 2000)
  pgUri: string;

  @IsString()
  @Length(3, 2000)
  s3Bucket: string;

  @IsString()
  @Length(3, 100)
  s3Region: string;

  @IsString()
  @Length(3, 100)
  s3Key: string;

  @IsString()
  @Length(3, 100)
  s3Secret: string;
}
