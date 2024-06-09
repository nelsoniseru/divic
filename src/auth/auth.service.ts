import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/signin.input';
import { BiometricInput } from './dto/biometric.input';
import { profileResponse } from './dto/profile-response';
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, 
    private jwtService: JwtService, 
    private configService: ConfigService
  ) {}

  /**
   * Registers a new user.
   * @param registerInput - The registration details containing email and password.
   * @returns An object containing the token and the newly created user.
   * @throws BadRequestException - If the user already exists.
   */
  async register(registerInput: RegisterInput) {
    const hashedPassword = await argon.hash(registerInput.password);
    const findUser = await this.prisma.user.findUnique({ where: { email: registerInput.email } });

    if (findUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: registerInput.email,
        password: hashedPassword
      }
    });

    const token = await this.createTokens(user.id, user.email);
    await this.updateBiometric(user.id, token);

    return { token, user };
  }

  /**
   * Logs in an existing user.
   * @param loginInput - The login details containing email and password.
   * @returns An object containing the token and the authenticated user.
   * @throws ForbiddenException - If the credentials are invalid.
   */
  async login(loginInput: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { email: loginInput.email } });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isMatch = await argon.verify(user.password, loginInput.password);
    if (!isMatch) {
      throw new ForbiddenException('Invalid credentials');
    }

    const token = await this.createTokens(user.id, user.email);
    await this.updateBiometric(user.id, token);

    return { token, user };
  }

  /**
   * Logs in a user using biometric authentication.
   * @param biometricInput - The biometric login details containing biometricKey.
   * @returns An object containing the token and the authenticated user.
   * @throws UnauthorizedException - If the token is invalid.
   */
  async biometric_login(biometricInput: BiometricInput) {
    const decodedToken = await this.verifyToken(biometricInput.biometricKey);
    const userId = decodedToken.userId;
    const email = decodedToken.email;
    const user = await this.prisma.user.findUnique({ where: { email } });

    const token = await this.createTokens(userId, email);
    await this.updateBiometric(userId, token);

    return { token, user };
  }

  /**
   * Retrieves the profile of a user.
   * @param email - The email of the user.
   * @returns An object containing the user profile.
   */
  async profile(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return { user };
  }

  /**
   * Creates a new JWT token for a user.
   * @param userId - The ID of the user.
   * @param email - The email of the user.
   * @returns A JWT token.
   */
  async createTokens(userId: number, email: string) {
    const token = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: this.configService.get('EXPIRES_IN'),
        secret: this.configService.get('ACCESS_TOKEN_SECRET')
      }
    );

    return token;
  }

  /**
   * Updates the biometric key for a user.
   * @param userId - The ID of the user.
   * @param token - The new biometric key.
   */
  async updateBiometric(userId: number, token: string) {
    const biometricKey = token;
    await this.prisma.user.update({ where: { id: userId }, data: { biometricKey } });
  }

  /**
   * Verifies a JWT token.
   * @param token - The JWT token to verify.
   * @returns The decoded token.
   * @throws UnauthorizedException - If the token is invalid.
   */
  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
