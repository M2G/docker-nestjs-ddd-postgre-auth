import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@application/dto/users';
import { UsersRepository } from '@infrastructure/repository';
import { User } from '@infrastructure/models';

@Injectable()
class UserService {
  constructor(
    @Inject(forwardRef(() => UsersRepository)) private readonly userRepository: UsersRepository,
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
  }): User[] {
    return this.userRepository.find({
      attributes,
      filters,
      page,
      pageSize,
    }) as any;
  }

  findOne({ id }: { id: number }): Promise<User | null> {
    return this.userRepository.findOne({ id });
  }

  register(createUserDto: CreateUserDto): User {
    return this.userRepository.register(createUserDto);
  }

  remove({ id }: { id: number }): Promise<boolean> {
    return this.userRepository.remove({ id });
  }

  update(updateUserDto: UpdateUserDto): User | null {
    return this.userRepository.update(updateUserDto) as any;
  }

  authenticate({ email }: { email: string }): Promise<User | null> {
    return this.userRepository.authenticate({ email });
  }

  changePassword({
    id,
    password,
    old_password,
  }: {
    id: number;
    password: string;
    old_password: string;
  }): Promise<User | null> {
    return this.userRepository.changePassword({ id, old_password, password } as User);
  }

  forgotPassword({ email }: { email: string }): Promise<User | null> {
    return this.userRepository.forgotPassword({ email });
  }

  resetPassword({
    password,
    reset_password_token,
  }: {
    password: string;
    reset_password_token: string;
  }): Promise<User | null> {
    return this.userRepository.resetPassword({ password, reset_password_token } as any);
  }
}

export default UserService;
