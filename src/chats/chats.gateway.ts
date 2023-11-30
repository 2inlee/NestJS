import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatsService } from "./chats.service";
import { EnterChatDto } from "./dto/enter-chat.dto";
import { CreateMessagesDto } from "./messages/dto/create-messages.dto";
import { ChatMssagesService } from "./messages/messages.service";
import { UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { SocketCatchHttpExceptionFilter } from "src/common/exception-filter/socket-catch-http.exception-filter";

@WebSocketGateway({
  //ws://localhost:3000/chats
    namespace: '/chats'
})
export class ChatsGateway implements OnGatewayConnection{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: ChatMssagesService,
  ) { }

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log('New connection', socket.id);
  }

  @UsePipes(new ValidationPipe({
    transform: true,
    // 임의로 변환하는걸 가능하게 만들어준다. ex) pagination에서 url파라미터를 number로 생각함
    transformOptions: {
      enableImplicitConversion: true,
    },
    whitelist : true,
    forbidNonWhitelisted: true,
  }))

  @UseFilters(SocketCatchHttpExceptionFilter)
  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket
  ){
    const chat = await this.chatsService.createChat(data);
  }

  @SubscribeMessage('enter_chat')
  enterChat(
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket
  ){
    for(const chatId of data.chatIds){
      const exists = this.chatsService.checkIfChatExists(chatId);

      if(!exists){
        throw new WsException({
          code: 100,
          message: `존재하지 않는 ${chatId} 입니다.`
        });
      }
    }

    
    socket.join(data.chatIds.map((x) => x.toString()));
    }

  // socket.on('send_message', (message) => { console.log(message)});
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket
  ) {

    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);

    if(!chatExists){{
      throw new WsException({
        code: 100,
        message: `존재하지 않는 ${dto.chatId} 입니다.`
        });
      }
    }

    const message = await this.messagesService.createMessage(dto); 
    // socket.to - send message to all users in the room except the sender
    socket.to(message.chat.id.toString()).emit('receive_message', message.message);

    // server.in - send message to all users in the room
    // this.server.in(message.chatId.toString()).emit('receive_message', message.message);
  }
}