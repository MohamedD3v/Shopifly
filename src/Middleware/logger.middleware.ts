import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    console.log(`${new Date().toISOString()}-${method}-${url}`);
    next();
  }
}

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization)
      throw new BadRequestException('Please Input authorization Key');
    next();
  }
}

export function logger(req: Request, res: Response, next: NextFunction) {
  const { url, method } = req;
  console.log(`${new Date().toISOString()}-${method}-${url}`);
  next();
}
