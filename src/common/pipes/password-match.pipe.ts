import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
@Injectable()
export class PasswordMatchPipe implements PipeTransform {
  transform(value: any, metaData: ArgumentMetadata) {
    if (metaData.type === 'body') {
      const { password, confirmPassword } = value;
      if (password !== confirmPassword) {
        throw new BadRequestException('Password not match');
      }
    }
    return value;
  }
}
