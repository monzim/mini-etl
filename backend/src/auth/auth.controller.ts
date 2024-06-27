import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

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
    const user = req.user;
    const payload = {
      sub: user.id,
      username: user.username,
      name: user.displayName,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }
}
