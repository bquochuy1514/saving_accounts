// src/common/factories/validation-exception.factory.ts
import { BadRequestException, ValidationError } from '@nestjs/common';

export const validationExceptionFactory = (errors: ValidationError[]) => {
  const formatted = errors.reduce((acc, err) => {
    acc[err.property] = Object.values(err.constraints);
    return acc;
  }, {});

  return new BadRequestException({
    statusCode: 400,
    error: 'Bad Request',
    message: formatted,
  });
};
