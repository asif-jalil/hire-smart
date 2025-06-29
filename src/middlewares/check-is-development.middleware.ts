import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { EnvService } from 'src/shared/services/env.service';

@Injectable()
export class CheckIsDevelopment implements NestMiddleware {
  constructor(private env: EnvService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (this.env.isProduction) {
      return next(new NotFoundException(`Cannot ${req.method} ${req.baseUrl}`));
    }

    next();
  }
}
