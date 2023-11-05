import { Column, Entity } from "typeorm";

@Entity()
export class PostsModel {
  @Column()
  id : number;

  @Column()
  author : string;

  @Column()
  title : string;

  @Column()
  content : string;

  @Column()
  likeCount : number;

  @Column()
  commentCount : number;
}