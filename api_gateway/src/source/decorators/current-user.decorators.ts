import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUser } from 'src/types/AuthUser';

type UserRecord = keyof AuthUser;

export const CurrentUser = createParamDecorator(
  (data: UserRecord, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;
    if (user && user.id) {
      return data ? user[data] : user;
    } else {
      throw new UnauthorizedException('User not found or JWT invalid');
    }
  },
);
