import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  logger = new Logger('HTTP');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${context.switchToHttp().getResponse().statusCode} ${context.switchToHttp().getRequest().method} ${Date.now() - now}ms -${context.switchToHttp().getRequest().url} ${context.getClass().name}.${context.getHandler().name}`,
          ),
        ),
      );
  }
}
