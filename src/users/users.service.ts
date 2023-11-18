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

  async createUser(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {

    // 1) nickname 중복이 있는 지
    // exist() -> 만약에 조건에 해당되는 값이 있으면 true

    const nicknameExist = await this.userRepository.exist({
      where: {
        nickname: user.nickname,
      },
    });
    if(nicknameExist)
      throw new Error('이미 존재하는 닉네임입니다.');

    const emailExist = await this.userRepository.exist({
      where: {
        email: user.email,
      },
    });
    if(emailExist)
      throw new Error('이미 존재하는 이메일입니다.');

    


    const userObject = this.userRepository.create({
      nickname:user.nickname,
      email:user.email,
      password:user.password,
    });

    const newUser = await this.userRepository.save(user);
    return newUser;
  }

  async getAllUsers() {
    return this.userRepository.find();
  }
  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
