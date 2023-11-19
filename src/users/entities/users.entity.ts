import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostModel } from "src/posts/posts.service";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length } from "class-validator";

@Entity()
export class UsersModel extends BaseModel{

  @Column({
    length: 20,
    unique: true,
  })

  @Length(1, 20, {
    message: '닉네임은 1~20자리로 입력해주세요.',
  })
  @IsString({
    message: '닉네임은 문자열로 입력해주세요.',
  })
  nickname: string;
  
  @IsEmail()
  @IsString({
    message: '이메일은 문자열로 입력해주세요.',
  })
  @Column()
  email: string;

  @Length(3, 8, {
    message: '비밀번호는 3~8자리로 입력해주세요.',
  })
  @IsString({
    message: '비밀번호는 문자열로 입력해주세요.',
  })
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostModel[];
}