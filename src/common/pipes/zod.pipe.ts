import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod'; // Import ZodError

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      if (metadata.type == 'body') {
        const parsedValue = this.schema.parse(value);
        return parsedValue;
      }
    } catch (error) {
      // handle error message
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        }));
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: errorMessages,
        });
      }
      throw new BadRequestException('An unknown validation error occurred');
    }
  }
}
