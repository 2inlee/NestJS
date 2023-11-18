import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";


@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    return value.toString();
  }
}
