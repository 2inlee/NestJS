import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,
  ) {}

  async createUser(nickname: string, email: string, password: string) {
    const user = this.userRepository.create({
      nickname,
      email,
      password
    });

    const newUser = await this.userRepository.save(user);
    return newUser;
  }
}
