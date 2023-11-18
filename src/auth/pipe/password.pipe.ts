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


@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > this.length) {
      throw new BadRequestException(`Value must be shorter than ${this.length} characters`);
    }

    return value.toString();
  }
}


@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > this.length) {
      throw new BadRequestException(`Value must be longer than ${this.length} characters`);
    }

    return value.toString();
  }
}