import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { paginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import { ConfigService } from '@nestjs/config';
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from 'src/common/const/env-keys.const';
import { basename, join } from 'path';
import { POST_IMAGE_PATH, PUBLIC_FOLDER_PATH, TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { promises } from 'fs';
/**
 * author : string;
 * title : string;
 * content : string;
 * likeCount : number;
 * commentCount : number;
 */
export interface PostModel {
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

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ){}

  async getAllPosts(){
    return this.postsRepository.find({
      relations: ['author'],
    });
  }


  async generatePosts(userId: number){
    for(let i = 0; i < 100; i++){
      await this.createPost(userId, {
        title: `임의로 생성된 포스트 제목 ${i}`,
        content: `임의로 생성된 포스트 내용 ${i}`,
      });
    }
  }

  // 1) 오름차 순으로 정렬하는 pagination만 구현한다.
  async paginatePosts(dto: paginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.postsRepository,
      {
        relations: ['author']
      },
      'posts',
    );
    // if(dto.page){
    //   return this.pagePaginatePosts(dto);
    // }else{
    //   return this.cursorPaginatePosts(dto);
    // }
  }

  async pagePaginatePosts(dto: paginatePostDto){
    /**
     * data: Data[]
     * total: number
     * next: ?? 일반적으로 UI에서 페이지 버튼이 나와있기 때문에 next가 필요없다.
     * 
     * [1] [2] [3] [4]
     */
    
    const [posts, count] = await this.postsRepository.findAndCount({
      skip: (dto.page - 1) * dto.take,
      take: dto.take,
      order: {
        createdAt: dto.order__createdAt,
      },
    });

    return {
      data: posts,
      total: count,
    }
  }

  
  async cursorPaginatePosts(dto: paginatePostDto){
    const where: FindOptionsWhere<PostsModel> = {};
  
    // 조건 설정
    if (dto.where__id__less_than) {
      where.id = LessThan(dto.where__id__less_than);
    } else if (dto.where__id__more_than) {
      where.id = MoreThan(dto.where__id__more_than);
    }
  
    // 데이터베이스에서 게시물 조회
    const posts = await this.postsRepository.find({
      where: where,
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });
  
    // 마지막 항목 설정
    const lastItem = posts.length > 0 && posts.length == dto.take ? posts[posts.length - 1] : null;
  
    
    const protocol = this.configService.get<string>(ENV_PROTOCOL_KEY);
    const host = this.configService.get<string>(ENV_HOST_KEY);

    // 다음 URL 생성
    const nextURL = lastItem ? new URL(`${protocol}://${host}/posts`) : null;
  
    if (nextURL) {
      // 기존 파라미터를 URL에 추가
      for (const key of Object.keys(dto)) {
        if (dto[key] && key !== "where__id__more_than" && key !== "where__id__less_than") {
          nextURL.searchParams.append(key, dto[key]);
        }
      }
  
      // 새로운 where 조건 추가
      let key = dto.order__createdAt === 'ASC' ? 'where__id__more_than' : 'where__id__less_than';
      nextURL.searchParams.append(key, lastItem.id.toString());
    }
  
    // 응답 반환
    return {
      data: posts,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: posts.length,
      next: nextURL?.toString() ?? null,
    }
  }
  
  async getPostById(id: number){
    const post = await this.postsRepository.findOne({
      where: {
        id:id,
      },
      relations: ['author'], 
    });

    if(!post){ 
      throw new NotFoundException();
    }
    return post;
    }

  async createPostImage(dto: CreatePostDto){
    // dto의 이미지 이름을 기반으로
    //파일의 경로를 생성한다.
    const tempFilePath = join(TEMP_FOLDER_PATH, dto.image);

    try {
      // 파일이 존재하는지 확인
      //만약에 존재하지 않는다면 에러를 던짐
      promises.access(tempFilePath)
    } catch (e) {
      throw new BadRequestException('이미지가 존재하지 않습니다.');
    }

    // 파일의 이름만 가져오기
    // /Users/aaa/bbb/ccc/ddd.png -> ddd.png
    const fileName = basename(tempFilePath);

    // 새로 이동할 포스트 폴더의 경로 + 이미지 이름
    // {프로젝트 경로}/public/posts/asdf.jpg

    const newPath = join(POST_IMAGE_PATH, fileName);


    // 파일 옮기기
    await promises.rename(tempFilePath, newPath);

    return true;

  }

  

  async createPost(authorId: number, postDto: CreatePostDto){

    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> 저장할 객체를 저장한다.

    const post = this.postsRepository.create({
      author:{
        id:authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(postId: number, postDto: UpdatePostDto){

    const {title, content} = postDto;
    // save의 기능
    // 1) 만약에 데이터가 존재하지 않는다면 id를 기준으로 데이터를 생성한다.
    // 2) 만약에 데이터가 존재한다면 id를 기준으로 데이터를 수정한다.

    const post = await this.postsRepository.findOne({
      where: {
        id:postId,
      },
    });


    if(!post){
      throw new NotFoundException
    }

    

    if(title){
      post.title = title
    }

    if(content){
      post.content = content
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(postId:number){
    await this.postsRepository.delete(postId);
    const post = await this.postsRepository.findOne({
      where: {
        id:postId,
      },
    });

    if (!post){
      throw new NotFoundException();
    }
    

    return postId;
  }
}