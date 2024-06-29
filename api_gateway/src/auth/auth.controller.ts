import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/source/decorators/current-user.decorators';
import { AuthUser } from 'src/types/AuthUser';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  me(@CurrentUser() currentUser: AuthUser) {
    return this.service.getUser(currentUser.id);
  }

  @UseGuards(AuthGuard('github'))
  @Get('callback/github')
  authCallback(@CurrentUser() currentUser: AuthUser, @Res() res) {
    const { id } = currentUser;
    delete currentUser.id;

    const accessToken = this.jwtService.sign({
      sub: id,
      ...currentUser,
    });

    const url = this.configService.get<string>('AUTH_FRONTEND_REDIRECT_URL');
    res.redirect(`${url}?token=${accessToken}`);
  }
}
