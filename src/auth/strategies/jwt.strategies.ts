import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor to initialize JwtTokenStrategy.
   * 
   * @param config - An instance of ConfigService to access environment variables.
   */
  constructor(public config: ConfigService) {
    // Call the super constructor with the necessary options for JWT extraction and secret key
    super({
      // Extract JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Secret key to verify the JWT signature, retrieved from configuration
      secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
    });
  }

  /**
   * Validate the payload of the JWT.
   * 
   * @param payload - The decoded JWT payload.
   * @returns An object containing userId and email to be attached to the request.
   */
  async validate(payload) {
    // Return the userId and email from the payload to be used in request handling
    return { userId: payload.userId, email: payload.email };
  }
}
