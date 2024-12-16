import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import Config from '@config';
import UserService from '@domain/services/users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger();

  constructor(private readonly usersService: UserService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //secretOrKey: Config.authSecret || 'secret',
      secretOrKey: 'secret',
    });
  }

  validate(payload) {
    return payload;
  }
}
