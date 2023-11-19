import { IsString } from "class-validator";

export class createPostDto {
  @IsString({
    message: '제목은 문자열로 입력해주세요.',
  })
  title: string;

  @IsString({
    message: '내용은 문자열로 입력해주세요.',
  })
  content: string;
}