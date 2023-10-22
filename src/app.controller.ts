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
 
// Controller 에 어떤 parameter를 붙이는 지 -> 해당 Class 의 모든 Endpoint의 prefix가 된다.
@Controller('post')
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
