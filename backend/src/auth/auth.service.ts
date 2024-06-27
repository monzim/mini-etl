import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: string) {
    let user = await this.prisma.users.findUnique({
      where: { id: id },
    });

    return user;
  }
}
