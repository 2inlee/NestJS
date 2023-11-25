import { Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseModel } from './entity/base.entity';

@Injectable()
export class CommonService {
  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T>= {},
    path: string,
  ){
    if(dto.page){
      return this.pagePaginate(dto, repository, overrideFindOptions);
    }
    else{
      return this.cursorPaginate(dto, repository, overrideFindOptions, path);
    }
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T>= {},
  
  ){
    
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T>= {},
    path: string,
  ){
    /**
     * where__likeCount_more_than
     * 
     * where__title_ilike
     */

  }
  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ) : FindManyOptions<T>{
    /**
     * where,
     * order,
     * take,
     * skip -> page 기반일 때만
     */

    /**
     * DTO의 현재 생긴 구조는 아래와 같다
     * 
     * {
     *   where__id__nore_than:1,
     *   order__createdAt: 'ASC',
     * }
     * 
     * 현재는 where__id__more_than / where__id__less_than에 해당되는 where필터만 사용중이지만
     * 나중에는 where__likeCount__more_than이나 where__title__ilike 등 추가 필터를 넣고싶어졌을 때
     * 모든 where 필터들을 자동으로 파싱 할 수 있을만한 기능을 제작헤야 한다.
     * 
     * 1) where로 시작한다면 필터 로직을 적용한다.
     * 2) order로 시작한다면 정렬 로직을 적용한다.
     * 3) 필터 로직을 적용한다면 '__' 기준으로 Split 했을 때 3개의 값으로 나뉘는지
     *   2개의 값으로 나뉘는 지 확인한다.
     *   3-1) 3개의 값으로 나뉘면 FILTER_MAPPER에서 해당되는 operator 함수를 찾아서 적용한다.
     *       ['where', 'id', 'more_than']
     *   3-2) 2개의 값으로 나뉘면 정확한 값을 필터 하는 것이기 때문에 operator 함수를 사용하지 않는다.
     *       where__id
     *       ['where', 'id']
     * 4) order의 경우 3-2)와 같이 적용한다.
  }
}
