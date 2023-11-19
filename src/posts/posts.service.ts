import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
    const post = await this.postsRepository.findOne({
      where: {
        id:postId,
      },
    });

    if (!post){
      throw new NotFoundException();
    }
    
    await this.postsRepository.delete(postId);

    return postId;
  }
}