import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * author : string;
 * title : string;
 * content : string;
 * likeCount : number;
 * commentCount : number;
 */
interface Post {
  author : string;
  title : string;
  content : string;
  likeCount : number;
  commentCount : number;
}
 

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPost(): Post {
    return{
      author : 'newjeans_official',
      title : 'newjeans minji',
      content : 'hot newjeans',
      likeCount : 1000000,
      commentCount : 2000000,
    };
  }
}
