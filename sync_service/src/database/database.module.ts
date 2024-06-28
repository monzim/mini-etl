import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, DrizzleService],
  exports: [PrismaService, DrizzleService],
})
export class DatabaseModule {}
