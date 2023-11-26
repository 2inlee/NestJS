import { Transform } from "class-transformer";
import { IsString } from "class-validator";
import { join } from "path";
import { identity } from "rxjs";
import { POST_PUBLIC_IMAGE_PATH } from "src/common/const/path.const";
import { BaseModel } from "src/common/entity/base.entity";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PostsModel extends BaseModel{

  // 1) UsersModel과 연동된다. 외래키 이용
  // 2) null 불가능
  @ManyToOne(() => UsersModel, (user) => user.posts,{ 
    nullable: false, onDelete: 'CASCADE' 
  })
  author : UsersModel;

  @Column()
  @IsString({
    message: stringValidationMessage
  })
  title : string;

  @IsString({
    message: stringValidationMessage
  })
  @Column()
  content : string;

  @Column({
    nullable: true
  })
  @Transform(({value})=> value && `/${join(POST_PUBLIC_IMAGE_PATH,value)}`)
  image?: string;

  @Column()
  likeCount : number;

  @Column()
  commentCount : number;

}