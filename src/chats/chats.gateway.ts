import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatsService } from "./chats.service";

@WebSocketGateway({
  //ws://localhost:3000/chats
    namespace: '/chats'
})
export class ChatsGateway implements OnGatewayConnection{
  constructor(
    private readonly chatsService: ChatsService,
  ) { }

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log('New connection', socket.id);
  }

  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket
  ){
    const chat = await this.chatsService.createChat(data);
  }

  @SubscribeMessage('enter_chat')
  enterChat(
    @MessageBody() data: number[],
    @ConnectedSocket() socket: Socket
  ){
    for(const chatId of data){
      // socket.join();
      socket.join(chatId.toString());
    }
  }

  // socket.on('send_message', (message) => { console.log(message)});
  @SubscribeMessage('send_message')
  sendMessage(
    @MessageBody() message: {message: string, chatId: number},
    @ConnectedSocket() socket: Socket
  ) {
    // socket.to - send message to all users in the room except the sender
    socket.to(message.chatId.toString()).emit('receive_message', message.message);

    // server.in - send message to all users in the room
    // this.server.in(message.chatId.toString()).emit('receive_message', message.message);
  }
}