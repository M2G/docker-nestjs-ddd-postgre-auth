import { Controller, Post, Body, ValidationPipe, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '@domain/services';
import { LocalAuthGuard } from '@application/auth/guards';
import { CreateUserDto } from '@application/dto';

@Controller('auth')
class AuthController {
  constructor(
    private readonly authService: AuthService,
    //  private readonly i18n: YcI18nService,
  ) {}
  
  @Post('register')
  create(@Body(new ValidationPipe()) user: CreateUserDto) {
    return this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('authenticate')
  login(@Request() { user }) {
    return this.authService.login(user);
  }
}

export default AuthController;
