import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ZodValidateException } from '@/lib/exception/ZodValidateException';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new ZodValidateException(error);
    }
  }
}
