import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageModel } from "./entity/messages.entity";
import { FindManyOptions, Repository } from "typeorm";
import { CommonService } from "src/common/common.service";
import { BasePaginationDto } from "src/common/dto/base-pagination.dto";

@Injectable()
export class ChatMssagesService{
  constructor(
    @InjectRepository(MessageModel)
    private readonly messagesRepository: Repository<MessageModel>,
    private readonly commonService: CommonService,
  ) {}

  createChat() {
     
  }
  paginateChats(
    dto: BasePaginationDto,
    overrideFindOptions: FindManyOptions<MessageModel>,
  ) {
    return this.commonService.paginate(
      dto,
      this.messagesRepository,
      overrideFindOptions,
      'messages',
    )
  }
}