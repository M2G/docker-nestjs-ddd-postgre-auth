import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  ResetPasswordDTO,
  ForgotPasswordDTO,
  ChangePasswordDTO,
  AuthenticateDto,
} from '@application/dto';
import { UsersRepository } from '@infrastructure/repository';
import { UserEntity as User } from '@domain/entities';
import { UserTypeResultData } from '@domain/interfaces';

@Injectable()
class UserService {
  constructor(
    @Inject(forwardRef(() => UsersRepository)) private readonly userRepository: UsersRepository,
    // private readonly userRepository: UsersRepository,
  ) {}

  find({
    filters,
    page,
    pageSize,
  }: {
    filters: string;
    page: number;
    pageSize: number;
  }): Promise<{
    pageInfo: {
      count: number;
      next: number | null;
      pages: number;
      prev: number | null;
    },
    results: UserTypeResultData [];
  }> {
    return this.userRepository.find({
      filters,
      page,
      pageSize,
    });
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne(id);
  }

  register(createUser: CreateUserDto): Promise<boolean> {
    return this.userRepository.register(createUser);
  }

  remove(id: number): Promise<boolean> {
    return this.userRepository.remove(id);
  }

  update(updateUser: { id: number } & UpdateUserDto): Promise<boolean> {
    return this.userRepository.update(updateUser);
  }

  authenticate(email: AuthenticateDto): Promise<User | null> {
    return this.userRepository.authenticate(email);
  }

  changePassword(
    changePasswordUser: {
      id: number;
    } & ChangePasswordDTO,
  ): Promise<boolean | null> {
    return this.userRepository.changePassword(changePasswordUser);
  }

  forgotPassword(forgotPasswordUser: ForgotPasswordDTO): Promise<boolean | null> {
    return this.userRepository.forgotPassword(forgotPasswordUser);
  }

  resetPassword(resetPasswordUser: ResetPasswordDTO): Promise<boolean | null> {
    return this.userRepository.resetPassword(resetPasswordUser);
  }
}

export default UserService;
