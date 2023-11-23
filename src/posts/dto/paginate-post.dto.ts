import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional } from "class-validator";

export class paginatePostDto{

  // 이전 마지막 데이터의 ID
  // 이 프로퍼티에 입력된 ID 보다 높은 ID부터 값을 가져오기 

  // Query는 URL에 있는 값이라서 전부 String으로 들어온다.
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  // 정렬
  // createAt -> 생성된 시간의 내림차/오름차 순으로 정렬
  @IsIn(['ASC']) //해당 IsIn 안에 있는 값이 들어왔을 때만 Validation이 통과된다.
  order__createAt?: 'ASC' = 'ASC'; // 기본값으로 ASC 설정

  // 몇개의 데이터를 응답으로 받을지
  @IsNumber()
  @IsOptional()
  take: number = 20; // 기본값으로 20개 설정

}