import { Controller } from '@nestjs/common';

@Controller('app')
export class AppController {
  Any() {
    return `Current time is ${new Date().toLocaleTimeString()}`;
  }
}
