import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

/**
 * author : string;
 * title : string;
 * content : string;
 * likeCount : number;
 * commentCount : number;
 */
interface PostModel {
  id : number;
  author : string;
  title : string;
  content : string;
  likeCount : number;
  commentCount : number;
}

let posts : PostModel[] = [
  {
    id : 1,
    author : 'newjeans_official',
    title : 'newjeans minji',
    content : 'hot newjeans',
    likeCount : 1000000,
    commentCount : 2000000,
  },
  {
    id : 2,
    author : 'newjeans_official',
    title : 'newjeans hingi',
    content : 'cool newjeans',
    likeCount : 2000000,
    commentCount : 3000000,
  },
  {
    id : 3,
    author : 'blackpink_official',
    title : 'newjeans black',
    content : 'cool black',
    likeCount : 3000000,
    commentCount : 4000000,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}


  // 1) GET /posts
  // 모든 post를 가져온다.

  @Get()
  getPosts(){
    return posts;
  }

  // 2) GET /posts/:id
  // id에 해당되는 post를 가져온다
  // 예를 들어 id = 1이면 id가 1인 post를 가져온다.

  // 3) POST /posts
  // 새로운 post를 생성한다.

  // 4) PUT /posts/:id
  // id에 해당되는 post를 수정한다.

  // 5) DELETE /posts/:id
  // id에 해당되는 post를 삭제한다.

  
}
