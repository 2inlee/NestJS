import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostModel } from "src/posts/posts.service";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length } from "class-validator";
import { lengthValidationMessage } from "src/common/validation-message/length-validation,message";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";
import { Exclude, Expose } from "class-transformer";

@Entity()
@Exclude()
export class UsersModel extends BaseModel{

  @Column({
    length: 20,
    unique: true,
  })

  @Expose()
  @Length(1, 20, {
    message:lengthValidationMessage,
  })
  @IsString({
    message: stringValidationMessage
  })
  nickname: string;

  @Expose()
  @IsEmail()
  @IsString({
    message: emailValidationMessage
  })
  @Column()
  email: string;


  @Length(3, 8, {
    message:lengthValidationMessage,
  })
  @IsString({
    message: stringValidationMessage
  })
  @Column()
  /**
   * Request
   * frontend - > backend
   * plain object (json)-> class instance (dto)
   * 
   * Response
   * backend -> frontend
   * class instance (dto) -> plain object (json)
   * 
   * toClassOnly -> class instance로 변환될 때만 (요청)
   * toPlainOnly -> plain object로 변환될 때만 (응답)
   */

  // 아래와 같이 toPlainOnly: true를 설정하면 응답이 나갈때 비밀번호를 제외시킬 수 있다.
  @Exclude({
    toPlainOnly: true,
  })
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