import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ZodSchema, ZodError } from "@recruitment/schema";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        throw new BadRequestException({
          message: "数据验证失败",
          errors: errorMessages,
        });
      }
      throw new BadRequestException("验证失败");
    }
  }
}

// 用于装饰器的工厂函数
export const ZodValidation = (schema: ZodSchema) =>
  new ZodValidationPipe(schema);
