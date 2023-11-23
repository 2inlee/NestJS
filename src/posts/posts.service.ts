import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { paginatePostDto } from './dto/paginate-post.dto';

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
  async paginatePosts(dto: paginatePostDto){
    // 1,2,3,4,5
    const posts = await this.postsRepository.find({
      where:{
        //더 크다 / 더 많다
        id : MoreThan(dto.where__id_more_than ?? 0),
      },
      order:{
        createdAt: dto.order__createAt,
      },
      take: dto.take,
    });


  /**
   * 
   * Response
   * 
   * data: Data[]
   * cursor: {
   *   after: 마지막 Data의 id
   * },
   * count: 응답한 데이터의 갯수
   * next: 다음 요청을 할 때 사용할 URL
   */

  return{
    data: posts,
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