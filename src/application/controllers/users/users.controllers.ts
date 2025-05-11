import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Request,
  UseGuards,
  HttpStatus,
  HttpCode,
  Put,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UserService } from '@domain/services';
import { UserEntity as User } from '@domain/entities';
import { JwtAuthGuard } from '@application/auth/guards';
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  UpdateUserDto,
  ChangePasswordDTO,
  CreateUserDto,
} from '@application/dto';
import { UserTypeResultData } from '@domain/interfaces';

//@UseGuards(JwtAuthGuard)
@Controller('users')
class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  findAll(@Request() { query: { filters, page, pageSize } }): Promise<{
    pageInfo: {
      count: number;
      next: number | null;
      pages: number;
      prev: number | null;
    };
    results: UserTypeResultData[];
  }> {
    return this.usersService.find({
      filters,
      page,
      pageSize,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(Number(id));
    /*
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.notFound', {
          args: { id },
        }),
      );
    }
    */
    return user as unknown as User;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUser: UpdateUserDto,
  ): Promise<boolean> {
    return this.usersService.update({ ...updateUser, id: Number(id) });
  }

  @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<boolean> {
    const removeUser = await this.usersService.remove(Number(id));
    /*
   if (!removeUser) {
   throw new NotFoundException(
     this.i18n.t('users.notFound', {
       args: { id },
     }) as string,
   );
 }
 */
    console.log(!!removeUser);
    return !!removeUser;
  }

  @Post('register')
  create(@Body(new ValidationPipe()) createUser: CreateUserDto) {
    console.log('create create create', createUser);
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

  @Post('change-password')
  async changePassword(
    @Body(new ValidationPipe()) { password, old_password }: ChangePasswordDTO,
    //  @Request() { user: { id } },
  ) {
    const changedPassword = await this.usersService.changePassword({
      id: 13,
      old_password,
      password,
    });
  }
}

export default UsersController;
