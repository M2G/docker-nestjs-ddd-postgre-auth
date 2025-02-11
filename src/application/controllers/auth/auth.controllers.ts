import { Controller, Post, Body, ValidationPipe, Request, UseGuards } from '@nestjs/common';
import { AuthService, YcI18nService } from '@domain/services';
import { LocalAuthGuard, JwtAuthGuard } from '@application/auth/guards';

@Controller('auth')
class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: YcI18nService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  create(@Body(new ValidationPipe()) createUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('authenticate')
  login(@Request() { user }) {
    return this.authService.login(user);
  }
}

export default AuthController;
