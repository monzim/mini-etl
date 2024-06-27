import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { NewConnectionDto } from './dto/new-connection.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('new_connection')
  async handleNewConnection(@Payload() data: NewConnectionDto) {
    this.appService.handleNewConnection(data);
  }
}
