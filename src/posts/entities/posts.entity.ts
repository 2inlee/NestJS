import { identity } from "rxjs";
import { BaseModel } from "src/common/entity/base.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PostsModel extends BaseModel{

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