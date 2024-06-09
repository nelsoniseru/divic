import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'
import { JwtTokenStrategy } from './strategies/jwt.strategies';
@Module({
  providers: [AuthResolver, AuthService, JwtService, PrismaService,JwtTokenStrategy],
})
export class AuthModule {}
