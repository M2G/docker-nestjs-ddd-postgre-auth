// refreshToken
import {
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
} from '@nestjs/common';
import TokenService from '@domain/services/token';
// import AuthService from '@domain/services/auth/auth.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('auth')
// @UseGuards(JwtAuthGuard)
class TokenControllers {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh_token')
  refreshToken(@Body(new ValidationPipe()) refreshToken): any {
    return this.tokenService.refreshToken(refreshToken);
  }
}

export default TokenControllers;
