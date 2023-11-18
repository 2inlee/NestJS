import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
 
  @Post('login/email')
  loginEamil(
    @Headers('authorization') rawToken: string,
    ) {
      //email, password -> base64
      // asdfadfajkdshfkahsdfkhd -> email:password
      const token = this.authService.extractTokenFromHeader(rawToken, false);

      const credential = this.authService.decodeBasicToken(token);

      return this.authService.loginWithEmail(credential);
  }

  @Post('register/email')
  registerEmail(@Body('nickname') nickname: string,
  @Body('email') email: string,
  @Body('password') password: string) {
    return this.authService.registerWithEmail({
      nickname, email, password
    });
  }
}
