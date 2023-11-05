import { Injectable, NotFoundException } from '@nestjs/common';


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
  getAllPosts(){
    return posts;
  }

  getPostById(id: number){
    const post = posts.find(post => post.id === +id);

    if(!post){
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  createPost(author: string, title: string, content: string){
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

  updatePost(id: number, author: string, title: string, content: string){
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

  deletePost(id:number){
    const post = posts.find((post) => post.id === +id);
      if(!post)
      {
        throw new NotFoundException();
      }

      posts = posts.filter(post => post.id !== +id);

      return id;
  }
}