import { BadRequestException, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import {v4 as uuid} from 'uuid';
import { ImageModel } from 'src/common/entity/image.entity';
import { PostImagesService } from './image/dto/image.service';
import { LogMiddleware } from 'src/common/middelware/log.middleware';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
      ImageModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
    ],
  controllers: [PostsController],
  providers: [PostsService, PostImagesService],
})

export class PostsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
    LogMiddleware,)
    .forRoutes({
      path: 'posts',
      method: RequestMethod.ALL,
    });
  }
}
