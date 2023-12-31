import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import { ENV_HASH_ROUND_KEY, ENV_JWT_SECRET_KEY } from 'src/common/const/env-keys.const';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /***
   * 토큰을 사용하게 되는 방식
   * 
   * 1) 사용자가 로그인 또는 회원가입을 진행하면
   *   access_token, refresh_token을 발급한다.
   * 2) 로그인 할 때는 Basic 토큰과 함께 여청을 보낸다.
   *   Basic 토큰은 '이메일:비밀번호'를 Base64로 인코딩한 형태이다.
   *   예) {authorization: 'Basic {token}' }
   * 3) 아무나 접근 할 수 없는 정보 {private route}를 접근 할 때는
   *   accessToken을 Header에 추가해서 요청과 함께 보낸다.
   *    예) {authorization" 'Bearer {token} '}
   * 4) 토큰과 요청을 함께 받은 서버는 토큰 검증을 통해 현재 요청을 보낸 사용자가 누구인지 알 수 있다.
   *    예를 들어서 현재 로그인한 사용자가 작성한 포스트만 가져오려면
   *    토큰의 sub 값에 입력돼있는 사용자의 포스트만 따로 필터링 할 수 있다.
   *    특정 사용자의 토큰이 없다면 다른 사용자의 데이터를 접근 못한다.
   * 5) 모든 토큰은 만료 기간이 없다. 만료기간이 지남녀 새로 토큰을 발급받아야된다.
   *    그렇지 않으면 jwtService.verify()에서 인증이 통과 안된다.
   *    그러니 access토큰을 새로 발급 받을 수 있는 /auth/token/access와
   *    refresh 토큰을 새로 발급 받을 수 있는 /auth/token/refresh가 필요하다.
   * 6) 토큰이 만료되면 각각의 토큰을 새로 발급 받을 수 있는 엔드포인트에 요청을 해서
   *    새로운 토큰을 발급받고 새로운 토큰을 사용해서 private route에 접근한다.
  
   * /

  /**
   * Header로 부터 토큰을 받을 때 
   * 
   * {authorization: 'Basic {token}' }
   * {authorization" 'Bearer {token} '
   */

  extractTokenFromHeader(header: string, isBearer: boolean) {
    // 'Basic {token}'
    // [Basic, {token}]]
    // 'Bearer {token}'
    // [Bearer, {token}]]
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    if(splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }

    const token = splitToken[1];

    return token;
  }

  /**
   * Basic al:asdjhsjidfhjdjhfkjsddoas
   * 
   * 1) al:asdjhsjidfhjdjhfkjsddoas -> email:password
   * 2) email:password -> [email, password]
   * 3) {email:email, password:password}
   */
  decodeBasicToken(base64String: string) {
    const decode = Buffer.from(base64String, 'base64').toString('utf-8');

    const split = decode.split(':');

    if(split.length !== 2) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    }
  }


  // 토큰 검증
  verifyToken(token: string) {
    try{
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    }catch(e) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    } 
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
    });

    if(decoded.type !== 'refresh') {
      throw new UnauthorizedException('토큰 재발급은 refresh 토큰만 가능합니다.');
    }

    return this.signToken({
      ...decoded,
    }, isRefreshToken);
  }
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
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
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
    // 사용자가 존재하는지 확인 by email
    const existingUser = await this.usersService.getUserByEmail(user.email);
  
    // 사용자가 존재하지 않으면 에러 발생
    if (!existingUser) {
      throw new Error('사용자가 존재하지 않습니다.');
    }
  
    // 비밀번호가 맞는지 확인
    const passOk = await bcrypt.compare(user.password, existingUser.password);
  
    // 비밀번호가 틀리면 에러 발생
    if (!passOk) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
  
    // 모두 통과되면 사용자 정보 반환
    return existingUser;
  }
  

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
   const existingUser = await this.authenticateWithEmailAndPassowrd(user);
    return this.loginUser(existingUser);

  }

  async registerWithEmail(user: RegisterUserDto) {
    const hash = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get<string>(ENV_HASH_ROUND_KEY)),
    );

    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }
}