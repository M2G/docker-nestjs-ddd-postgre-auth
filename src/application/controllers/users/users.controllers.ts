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
  HttpStatus,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import UserService from '@domain/services/users';
import { YcI18nService } from '@domain/services';
import { UserEntity as User } from '@domain/entities';
import { JwtAuthGuard } from '@application/auth/guards';

@Controller('users')
@UseGuards(JwtAuthGuard)
class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly i18n: YcI18nService,
  ) {}

  @Get()
  findAll(@Request() { query: { ...args } }) {
    return this.usersService.find(args as unknown as never);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne({ id: Number(id) });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.notFound', {
          args: { id },
        }),
      );
    }
    return user as unknown as User;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateUserDto): User | null {
    return this.usersService.update({ id: Number(id), ...updateUserDto }) as any;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<boolean> {
    const user = await this.usersService.remove({ id: Number(id) });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.notFound', {
          args: { id },
        }) as string,
      );
    }
    return !!user;
  }

  @Post('register')
  create(@Body(new ValidationPipe()) createUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body(new ValidationPipe()) forgotPassword) {
    return this.usersService.forgotPassword(forgotPassword);
  }

  @Post('reset-password')
  resetPassword(@Body(new ValidationPipe()) { password }, @Request() { query: { token } }) {
    return this.usersService.resetPassword({
      password,
      reset_password_token: token,
    });
  }
}

export default UsersController;
