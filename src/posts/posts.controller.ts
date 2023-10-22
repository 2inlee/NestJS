import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

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


@Controller('')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  
  @Get('post')
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
