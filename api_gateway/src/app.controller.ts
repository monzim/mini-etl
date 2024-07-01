import { Controller, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

@Controller('app')
@UseInterceptors(LoggingInterceptor)
export class AppController {
  Any() {
    return `Current time is ${new Date().toLocaleTimeString()}`;
  }
}
