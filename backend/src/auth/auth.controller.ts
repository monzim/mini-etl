import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { JWTPayload } from 'src/types/JwtPayload';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req: any) {
    const payload = req.user as JWTPayload;

    return { accessToken: this.jwtService.sign(payload) };
  }
}
