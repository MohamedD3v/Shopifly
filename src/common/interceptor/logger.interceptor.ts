import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { url, method } = request;
    const now = Date.now();
    console.log(`${method} - ${url} - Starting Request..`);

    return next.handle().pipe(
      tap(() => {
        console.log(`after... ${Date.now() - now}Ms`);
      }),
    );
  }
}
