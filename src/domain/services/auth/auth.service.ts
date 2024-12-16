import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@application/dto/users';
import { AuthRepository } from '@infrastructure/repository';
import { User } from '@infrastructure/models';

@Injectable()
class AuthService {
  constructor(
    @Inject(forwardRef(() => AuthRepository)) private readonly authRepository: AuthRepository,
  ) {}

  validateUser(args): any {
    return this.authRepository.validateUser(args);
  }

  login(args): { accessToken: string } {
    return this.authRepository.login(args);
  }

  register(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    return this.authRepository.register(createUserDto);
  }
}

export default AuthService;
