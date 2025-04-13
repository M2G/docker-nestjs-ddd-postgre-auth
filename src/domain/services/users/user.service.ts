import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  ResetPasswordDTO,
  ForgotPasswordDTO,
} from '@application/dto';
import { UsersRepository } from '@infrastructure/repository';
import { UserEntity as User } from '@domain/entities';

@Injectable()
class UserService {
  constructor(
    // @Inject(forwardRef(() => UsersRepository)) private readonly userRepository: UsersRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  find({
    attributes,
    filters,
    page,
    pageSize,
  }: {
    attributes: string[] | undefined;
    filters: string;
    page: number;
    pageSize: number;
  }): Promise<User[]> {
    return this.userRepository.find({
      attributes,
      filters,
      page,
      pageSize,
    });
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne(id);
  }

  register(createUser: CreateUserDto): Promise<User> {
    return this.userRepository.register(createUser);
  }

  remove(id: number): Promise<boolean> {
    return this.userRepository.remove(id);
  }

  update(updateUser: UpdateUserDto): User | null {
    return this.userRepository.update(updateUser);
  }

  authenticate(email: string): Promise<User | null> {
    return this.userRepository.authenticate(email);
  }

  changePassword({ id, password, old_password }: User): Promise<User | null> {
    return this.userRepository.changePassword({ id, old_password, password } as User & {
      old_password: string;
    });
  }

  forgotPassword(email: ForgotPasswordDTO): Promise<User | null> {
    return this.userRepository.forgotPassword(email);
  }

  resetPassword({ password, reset_password_token }: ResetPasswordDTO): Promise<User | null> {
    return this.userRepository.resetPassword({ password, reset_password_token });
  }
}

export default UserService;
