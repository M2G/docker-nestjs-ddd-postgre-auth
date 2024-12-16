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
import UserService from '@domain/services/users';
import { YcI18nService } from '@domain/services';
import { LocalAuthGuard } from '@application/auth/guards/local.guard';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
// @UseGuards(JwtAuthGuard)
class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly i18n: YcI18nService,
  ) {}

  @Get()
  async findAll(@Request() req, @Res() response): Promise<any> {
    const { ...args } = req.query;
    const users = await this.usersService.find(args);
    return response.status(HttpStatus.OK).send(users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const user = await this.usersService.findOne({ id: Number(id) });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.notFound', {
          args: { id },
        }) as string,
      );
    }
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateUserDto): any {
    return this.usersService.update({ id: Number(id), ...updateUserDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response): Promise<any> {
    const user = await this.usersService.remove({ id: Number(id) });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.notFound', {
          args: { id },
        }) as string,
      );
    }
    response.status(HttpStatus.NO_CONTENT).send();
  }

  @Post('register')
  create(@Body(new ValidationPipe()) createUserDto): any {
    return this.usersService.register(createUserDto);
  }

  /*
  findOne
changePassword
forgotPassword
resetPassword
register
authenticate
update
   */
}

export default UsersController;
