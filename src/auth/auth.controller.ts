import { Body, Controller, Headers, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
 
  @Post('token/access')
  @UseGuards(AccessTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    /***
     * 
     * {accessToekn: {token}
     */
    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToekn: newToken
    };
  }
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  loginEamil(
    @Headers('authorization') rawToken: string,
    @Request() req,
    ) {
      //email, password -> base64
      // asdfadfajkdshfkahsdfkhd -> email:password
      const token = this.authService.extractTokenFromHeader(rawToken, false);

      const credential = this.authService.decodeBasicToken(token);

      return this.authService.loginWithEmail(credential);
  }

  @Post('register/email')
  postRegisterEmail(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body);
    }
  
  

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    /* 
     * {accessToekn: {token}
     */
    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken
    };
  }
}
