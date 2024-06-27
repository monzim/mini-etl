import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { JWTPayload } from 'src/types/JwtPayload';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: any) {
    return this.service.getUser(req.user.id);
  }

  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req: any) {
    const payload = req.user as JWTPayload;
    return { accessToken: this.jwtService.sign(payload) };
  }
}
