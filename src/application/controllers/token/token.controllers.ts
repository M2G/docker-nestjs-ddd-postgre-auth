import { Controller, Post, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { TokenService } from '@domain/services';
import { JwtAuthGuard } from '@application/auth/guards';

@Controller('auth')
@UseGuards(JwtAuthGuard)
class TokenControllers {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh_token')
  refreshToken(@Body(new ValidationPipe()) refreshToken) {
    return this.tokenService.refreshToken(refreshToken);
  }
}

export default TokenControllers;
