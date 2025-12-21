import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: Array<{ field: string; message: string } | string> = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message =
          (responseObj.message as string) ||
          (responseObj.error as string) ||
          'An error occurred';

        if (Array.isArray(responseObj.errors)) {
          errors = responseObj.errors as Array<
            { field: string; message: string } | string
          >;
        } else if (Array.isArray(responseObj.message)) {
          errors = responseObj.message as string[];
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      if (process.env.NODE_ENV === 'development') {
        errors = [exception.stack || exception.message];
      }
    }

    const errorResponse: ApiResponse = {
      success: false,
      message,
      errors: errors.length > 0 ? errors : undefined,
    };

    response.status(status).json(errorResponse);
  }
}
