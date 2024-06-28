import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(2000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          console.error('Synchronous Service timeout:', err);
          return throwError(
            () =>
              new HttpException(
                {
                  status: 'error',
                  message:
                    'The Synchronous Service is currently unavailable. Your request is being processed and will be completed once the service is back up.',
                },
                HttpStatus.GATEWAY_TIMEOUT,
              ),
          );
        }

        throw err;
      }),
    );
  }
}
