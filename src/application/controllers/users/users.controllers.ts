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
  HttpCode,
} from '@nestjs/common';
import UserService from '@domain/services/users';
import { UserEntity as User } from '@domain/entities';
import { JwtAuthGuard } from '@application/auth/guards';
import { ForgotPasswordDTO, ResetPasswordDTO, UpdateUserDto } from '@application/dto';
import CreateUserDto from '@application/dto/users/create-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
class UsersController {
  constructor(
    private readonly usersService: UserService,
    // private readonly i18n: YcI18nService,
  ) {}

  @Get()
  findAll(@Request() { query: { ...args } }): Promise<User[] | null> {
    return this.usersService.find(args);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(Number(id));
    /* if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.notFound', {
          args: { id },
        }),
      );
    } */
    return user as unknown as User;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUser: UpdateUserDto,
  ): User | null {
    return this.usersService.update({ ...updateUser, id: Number(id) });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<boolean> {
    const user = await this.usersService.remove(Number(id));
    /* if (!user) {
   throw new NotFoundException(
     this.i18n.t('users.notFound', {
       args: { id },
     }) as string,
   );
 } */
    return !!user;
  }

  @Post('register')
  create(@Body(new ValidationPipe()) createUser: CreateUserDto) {
    return this.usersService.register(createUser);
  }

  @Post('forgot-password')
  forgotPassword(@Body(new ValidationPipe()) forgotPassword: ForgotPasswordDTO): any {
    return this.usersService.forgotPassword(forgotPassword);
  }

  @Post('reset-password')
  resetPassword(
    @Body(new ValidationPipe()) { password }: ResetPasswordDTO,
    @Request() { query: { token } },
  ) {
    return this.usersService.resetPassword({
      password,
      reset_password_token: token,
    } as ResetPasswordDTO);
  }
}

export default UsersController;
