import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return 'Home Page';
  }

  @Get('post')
  getPosts() {
    return 'Posts Page';
  }

  @Get('user')
  getUsers() {
    return 'Users Page';
  }
}
