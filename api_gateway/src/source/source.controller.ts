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
import { AuthUser } from 'src/types/AuthUser';
import { CurrentUser } from './decorators/current-user.decorators';
import { AddDataSourceDto } from './dto/add-data-source.dto';
import { ConnectedSourceDto } from './dto/connected-source.dto';
import { SourceService } from './source.service';

@Controller('sources')
@UseGuards(AuthGuard('jwt'))
export class SourceController {
  constructor(private sourceService: SourceService) {}

  @Get('sync')
  @HttpCode(HttpStatus.OK)
  syncNow(@CurrentUser() currentUser: AuthUser) {
    return this.sourceService.syncNow(currentUser);
  }

  @Post('connect')
  @HttpCode(HttpStatus.CREATED)
  connectToSource(
    @CurrentUser() currentUser: AuthUser,
    @Body(ValidationPipe) data: ConnectedSourceDto,
  ) {
    return this.sourceService.connectToSource(currentUser, data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllDataSources(@CurrentUser() currentUser: AuthUser) {
    return this.sourceService.getAllDataSources(currentUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
