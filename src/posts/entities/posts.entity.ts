import { identity } from "rxjs";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostsModel {
  
  @PrimaryGeneratedColumn()
  id : number;

  // 1) UsersModel과 연동된다. 외래키 이용
  // 2) null 불가능
  @ManyToOne(() => UsersModel, (user) => user.posts,
  { nullable: false, onDelete: 'CASCADE' })
  author : UsersModel;

  @Column()
  title : string;

  @Column()
  content : string;

  @Column()
  likeCount : number;

  @Column()
  commentCount : number;
}