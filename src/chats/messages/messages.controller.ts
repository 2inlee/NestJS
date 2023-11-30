import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ChatMssagesService } from "./messages.service";
import { BasePaginationDto } from "src/common/dto/base-pagination.dto";

@Controller('chats/:cid/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: ChatMssagesService,
  ) {

  }
  @Get()
  paginateMessage(
    @Param('cid', ParseIntPipe)  id:number,
    @Query() dto: BasePaginationDto,
  ){
    return this.messagesService.paginateMessages(
      dto,
      {
        where: {
          chat: {
            id,
          }
        },
        relations: {
          author: true,
          chat: true,
        },
      }
    );
  }
}