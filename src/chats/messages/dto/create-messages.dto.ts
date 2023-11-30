import { PickType } from "@nestjs/mapped-types";
import { MessagesModel } from "../entity/messages.entity";
import { IsNumber } from "class-validator";
import { Entity } from "typeorm";

export class CreateMessagesDto extends PickType(MessagesModel,[
  'message',
]){
  @IsNumber()
  chatId: number;

}