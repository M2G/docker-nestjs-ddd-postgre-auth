import {
  Res,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '@domain/services';
import { YcI18nService } from '@domain/services';
import { LocalAuthGuard } from '@application/auth/guards/local.guard';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
// @UseGuards(JwtAuthGuard)
class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: YcI18nService,
  ) {}

  @Post('register')
  create(@Body(new ValidationPipe()) createUserDto): any {
    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('authenticate')
  login(@Request() req): any {
    return this.authService.login(req.user);
    // const authenticatedUser = await this.usersService.authenticate(user);
    // console.log('authenticatedUser', req.user);
  }
}

export default AuthController;
