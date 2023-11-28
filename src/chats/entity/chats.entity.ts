import { BaseModel } from "src/common/entity/base.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Entity, ManyToMany, OneToMany } from "typeorm";
import { MessageModel } from "../messages/entity/messages.entity";

@Entity()
export class ChatsModel extends BaseModel{
  @ManyToMany(()=> UsersModel, user => user.chats)
  users: UsersModel[];


  @OneToMany(()=> MessageModel, message => message.chat)
  messages: MessageModel;
}