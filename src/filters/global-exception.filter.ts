import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Response } from 'express';

type Exception = {
  response: Record<string, string>;
  status: number;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const status = (exception.status || exception['$metadata']?.httpStatusCode || 500) as number;
    const message = exception.response?.message || 'Something went wrong';
    const code = exception.response?.code || 'GlobalError';

    response.status(status).json({
      statusCode: status,
      message,
      code,
    });
  }
}
