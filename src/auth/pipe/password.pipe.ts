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
  constructor(private readonly length: number, private readonly subject?: string) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > this.length) {
      throw new BadRequestException(`${this.subject} must be shorter than ${this.length} characters`);
    }
    return value.toString();
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly length: number, private readonly subject?: string) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length < this.length) {
      throw new BadRequestException(`${this.subject} must be longer than ${this.length} characters`);
    }
    return value.toString();
  }
}
