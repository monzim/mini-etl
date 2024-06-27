import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/source/decorators/current-user.decorators';
import { AuthService } from './auth.service';
import { AuthUser } from 'src/types/AuthUser';

@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  me(@CurrentUser() currentUser: AuthUser) {
    return this.service.getUser(currentUser.id);
  }

  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  async authCallback(@CurrentUser() currentUser: AuthUser) {
    return { accessToken: this.jwtService.sign(currentUser) };
  }
}
