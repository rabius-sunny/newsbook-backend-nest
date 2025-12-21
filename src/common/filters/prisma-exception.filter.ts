import { HttpException, HttpStatus } from '@nestjs/common';

export class PrismaClientKnownRequestError extends HttpException {
  constructor(code: string, message?: string) {
    let statusCode = HttpStatus.BAD_REQUEST;
    let errorMessage = message || 'Database operation failed';

    switch (code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        errorMessage = message || 'A record with this value already exists';
        break;
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        errorMessage = message || 'Record not found';
        break;
      case 'P2003':
        statusCode = HttpStatus.BAD_REQUEST;
        errorMessage = message || 'Foreign key constraint failed on the field';
        break;
      case 'P2014':
        statusCode = HttpStatus.BAD_REQUEST;
        errorMessage =
          message ||
          'The change you are trying to make would violate a relation';
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = message || 'An unexpected database error occurred';
    }

    super(
      {
        success: false,
        message: errorMessage,
        errors: [`Prisma error code: ${code}`],
      },
      statusCode,
    );
  }
}

export function handlePrismaError(error: unknown): never {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  ) {
    const prismaError = error as { code: string; message?: string };
    throw new PrismaClientKnownRequestError(
      prismaError.code,
      prismaError.message,
    );
  }

  throw error;
}
