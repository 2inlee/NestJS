import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { BasePaginationDto } from "src/common/dto/base-pagination.dto";

export class paginatePostDto extends BasePaginationDto{
  @IsNumber()
  @IsOptional()
  where__likeCount__more_than: number;

  @IsString()
  @IsOptional()
  where__title_i_like: string;
}