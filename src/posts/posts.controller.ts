import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { NotFoundError } from 'rxjs';

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
  @Get(':id')
  getPost(@Param('id') id: string){
    const post =  posts.find(post => post.id === +id);

    if(!post){
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  // 3) POST /posts
  // 새로운 post를 생성한다.

  @Post() 
  postPosts(
    @Body('author') author:string,
    @Body('title') title:string, 
    @Body('content') content:string,
  ){
    const post : PostModel = {
      id: posts[posts.length -1].id + 1,
      author,
      title,
      content,
      likeCount: 0, 
      commentCount:0,
    };
    posts = [
      ...posts,
      post,
    ];

    return post;
  }

  // 4) PATCH /posts/:id
  // id에 해당되는 post를 수정한다.

  @Put(':id')
  putPost(
    @Param('id') id:string,
    @Body('author') author:string,
    @Body('title') title:string, 
    @Body('content') content:string,
  ){
    const post = posts.find(post => post.id === +id);

    if(!post){
      throw new NotFoundException
    }

    if(author){
      post.author
    }

    if(title){
      post.title
    }

    if(content){
      post.content
    }

    posts = posts.map(prevPost => prevPost.id === +id ? post : prevPost)

    return post;
  }

  // 5) DELETE /posts/:id
  // id에 해당되는 post를 삭제한다.

  @Delete(':id')
  deletePost(
    @Param('id') id: string,
    ){
      const post = posts.find((post) => post.id === +id);
      if(!post)
      {
        throw new NotFoundException();
      }

      posts = posts.filter(post => post.id !== +id);

      return id;
    }
}