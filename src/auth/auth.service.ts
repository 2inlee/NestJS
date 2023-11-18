import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * 1) resisterWithEmail
   *   - email, password, nickname를 입력받고 사용자를 생성한다.
   *   - 생성이 완료되면 access_token, refresh_token을 발급한다.
   *     회원가입 후 다시 로그인해주세요 <- 이런거 안하려고
   * 
   * 2) LoginWithEmail
   *  - email, password를 입력받고 사용자를 검증한다.
   *  - 검증이 완료되면 access_token, refresh_token을 발급한다. 
   *
   * 3) loginUser
   *  - (1)과 (2)에서 필요한 access_token, refresh_token을 발환하는 로직
   * 
   * 4) signToken
   *  - (3)에서 필요한 access_token, refresh_token을 sign하는 로직
   * 
   * 5) authenticateWithEmailAndPassowrd
   *  - (2)에서 필요한 email, password를 검증하는 로직
   *    1. 사용자가 존재하는 지 확인 by email
   *    2. 비밀번호가 맞는 지 확인
   *    3. 모두 통과되면 사용자 정보 반환
   *    4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   */

  /**
   * Payload 에 들어갈 정보
   * 1) email
   * 2) sub -> id
   * 3) type -> access_token, refresh_token
   *  */
  signToken(user: Pick<UsersModel, 'email' | 'id' >, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh_token' : 'access_token',
    }

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      //seconds
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);

    return {
      accessToken,
      refreshToken,
    }
  }

  async authenticateWithEmailAndPassowrd(user: Pick<UsersModel, 'email' | 'password'>) {
    /**
     * 1. 사용자가 존재하는 지 확인 by email
     * 2. 비밀번호가 맞는 지 확인
     * 3. 모두 통과되면 사용자 정보 반환
     */
    const existingUser = this.usersService.getUserByEmail(user.email);

    if(!existingUser){
      throw new Error('사용자가 존재하지 않습니다.');
    }

    /**
     * 파라미터
     * 
     * 1) 입력된 비밀번호
     * 2) 기존 해시 -> 사용자 정보에 저장돼있는 해시
     */
    const passOk = await bcrypt.compare(user.password, (await existingUser).password);

    if (!passOk) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    return existingUser;
  }

}