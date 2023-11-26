import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { paginatePostDto } from './dto/paginate-post.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource } from 'typeorm';
import { PostImagesService } from './image/dto/image.service';


@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postImagesService: PostImagesService,
    ) {}

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
  ){
    // 트랜잭션과 관련된 모든 쿼리를 담당할 쿼리 러너를 생성한다.
    const qr = this.dataSource.createQueryRunner();

    // 쿼리러너에 연결한다.
    await qr.connect();
    // 쿼리러너에서 트랜잭션을 시작한다.
    // 이 시점부터 같은 쿼리 러너를 사용하면
    // 트랜잭션안에서 데이터베이스 액션을 실행 할 수 있다.
    await qr.startTransaction();

    // 로직 실행
    try{
      const post = await this.postsService.createPost(
        userId, body, qr,
      );
  
      for(let i =0; i < body.images.length; i++){
        await this.postImagesService.createPostImage({
          post,
          order: i,
          path: body.images[i], 
          type: ImageModelType.POST_IMAGE,
        },qr);
      }

    await qr.commitTransaction()
    await qr.release();

    return this.postsService.getPostById(post.id);

    }catch(e){
      //어떤 에러든 에러가 던져지면
      // 트랜잭션을 종료하고 원래 상태로 되돌린다.
      await qr.rollbackTransaction();
      await qr.release();

      throw e;
      }
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
