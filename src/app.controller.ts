import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

//nestjs 처음 값
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'hi nestjs';
  }
}
