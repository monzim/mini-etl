import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { randomUUID } from 'crypto';
import { Profile, Strategy } from 'passport-github';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';
import { PrismaService } from 'src/database/prisma.service';
import { JWTPayload } from 'src/types/JwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      name: payload.username,
      avatar: payload.avatar,
      email: payload.email,
      display_name: payload.display_name,
    };
  }
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['public_profile', 'public_repo'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<JWTPayload> {
    let user = await this.prisma.users.findUnique({
      where: { id: profile.id },
    });

    const session_id = randomUUID();

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          id: profile.id,
          name: profile.username,
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
          display_name: profile.displayName,
          sessions: {
            create: {
              id: session_id,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
              provider_type: 'GITHUB',
              provider_id: profile.id,
            },
          },
          providers: {
            create: {
              id: profile.id,
              accessToken: accessToken,
              auth_provider_id: profile.provider,
              refreshToken: _refreshToken,
              type: 'GITHUB',
            },
          },
        },
      });

      return {
        avatar: user.avatar,
        display_name: user.display_name,
        email: user.email,
        session_id: session_id,
        sub: user.id,
        username: user.name,
      };
    }

    await this.prisma.providers.update({
      where: { id: profile.id, user_id: user.id, type: 'GITHUB' },
      data: { accessToken: accessToken, updatedAt: new Date() },
    });

    await this.prisma.sessions.create({
      data: {
        id: session_id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        provider_type: 'GITHUB',
        provider_id: profile.id,
        user_id: user.id,
      },
    });

    return {
      avatar: user.avatar,
      display_name: user.display_name,
      email: user.email,
      session_id: session_id,
      sub: user.id,
      username: user.name,
    };
  }
}
