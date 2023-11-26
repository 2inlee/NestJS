import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { paginatePostDto } from './dto/paginate-post.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  // 모든 post를 가져온다.
  @Get()
  getPosts(
    @Query() query: paginatePostDto,
  ){
    return this.postsService.paginatePosts(query);
  }

  //Post /posts/random
  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User() user: UsersModel){
    await this.postsService.generatePosts(user.id);

    return true;
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
  // DTO - Data Transfer Object

  // A Model, B Model
  // Post API -> A 모델을 저장하고, B모델을 저장한다.
  // await repository.save(A);
  // await repository.save(B);
  //
  // 만약에 a를 저장하다가 실패하면 b를 저장하면 안될경우
  // all or nothing
  // transaction
  // start -> 시작
  // commit -> 저장
  // rollback -> 원상복구
  @Post()
  @UseGuards(AccessTokenGuard)
  async postPosts(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ){
    await this.postsService.createPostImage(body);
    return this.postsService.createPost(userId, body);
  }

  // 4) PATCH /posts/:id
  // id에 해당되는 post를 수정한다.
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
    ){
      return this.postsService.updatePost(id, body)
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
