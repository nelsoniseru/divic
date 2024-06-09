import { Resolver, Query, Mutation, Args, Int,Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import {  RegisterInput } from './dto/register.input';
import {  LoginInput } from './dto/signin.input';
import { profileResponse } from './dto/profile-response';
import { SignResponse } from './dto/sign-response';
import { UseGuards } from '@nestjs/common';
import { JwtTokenGuard } from './guards/jwt.guards';
import { BiometricInput } from './dto/biometric.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() =>  SignResponse )
  register(@Args('RegisterInput')  registerInput:  RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() =>  SignResponse )
  login(@Args('LoginInput')  loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() =>  SignResponse )
  biometric_login(@Args('BiometricInput')  biometricInput:BiometricInput ) {
    return this.authService.biometric_login(biometricInput);
  }
  @UseGuards(JwtTokenGuard)
  @Query(() => profileResponse)
  profile(@Context() context) {
    const request = context.req;
    const user = request.user; 
    return this.authService.profile(user.email);
  }

}
