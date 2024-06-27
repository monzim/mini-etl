import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SyncService {
  public queue: ClientProxy;
  constructor(@Inject('SYNC_SERVICE') private readonly client: ClientProxy) {
    this.queue = this.client;
  }
}
