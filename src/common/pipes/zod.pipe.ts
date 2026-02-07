import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod/v3';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value) as unknown;
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed', error as Error);
    }
  }
}
