import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser as AuthUser } from 'src/types/AuthUser';
import { CurrentUser } from './decorators/current-user.decorators';
import { AddDataSourceDto } from './dto/add-data-source.dto';
import { SourceService } from './source.service';

@Controller('source')
export class SourceController {
  constructor(private sourceService: SourceService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllDataSources(@CurrentUser() currentUser: AuthUser) {
    return this.sourceService.getAllDataSources(currentUser);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  addDataToSource(
    @CurrentUser() currentUser: AuthUser,
    @Body(ValidationPipe) data: AddDataSourceDto,
  ) {
    if (data.type === 's3') {
      delete data.pgUri;
    } else {
      delete data.s3Bucket;
      delete data.s3Region;
      delete data.s3Key;
      delete data.s3Secret;
    }

    return this.sourceService.addDataToSource(currentUser.id, data);
  }
}
