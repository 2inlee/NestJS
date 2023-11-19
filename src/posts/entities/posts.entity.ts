import { IsString } from "class-validator";
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
  @IsString({
    message: '제목은 문자열로 입력해주세요.',
  })
  title : string;

  @IsString({
    message: '내용은 문자열로 입력해주세요.',
  })
  @Column()
  content : string;

  @Column()
  likeCount : number;

  @Column()
  commentCount : number;

}