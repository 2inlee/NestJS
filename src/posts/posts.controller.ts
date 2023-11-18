import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  // 모든 post를 가져온다.
  @Get()
  getPosts(){
    return this.postsService.getAllPosts();
  }

  // 2) GET /posts/:id
  // id에 해당되는 post를 가져온다
  // 예를 들어 id = 1이면 id가 1인 post를 가져온다.
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number){
    return this.postsService.getPostById(id);
  }

  // 3) POST /posts
  // 새로운 post를 생성한다.

  @Post()
  @UseGuards(AccessTokenGuard)
  postPosts(
    @Request() req:any,
    @Body('title') title?:string, 
    @Body('content') content?:string,
    @Body('isPublic', new DefaultValuePipe(true)) isPublic?:boolean,
  ){
    const authorId = req.user.id;
    return this.postsService.createPost(authorId, title, content);
  }



  // 5) DELETE /posts/:id
  // id에 해당되는 post를 삭제한다.

  @Delete(':id')
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    ){
      return this.postsService.deletePost(id)
    }
}
