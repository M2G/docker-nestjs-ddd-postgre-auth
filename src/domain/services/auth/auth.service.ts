import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, LoginDto } from '@application/dto';
import { AuthRepository } from '@infrastructure/repository';
import { User } from '@infrastructure/models';

@Injectable()
class AuthService {
  constructor(
    @Inject(forwardRef(() => AuthRepository)) private readonly authRepository: AuthRepository,
  ) {}

  validateUser(args): Promise<User | null> {
    return this.authRepository.validateUser(args);
  }

  login(loginDto: LoginDto): { accessToken: string } {
    return this.authRepository.login(loginDto);
  }

  register(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    return this.authRepository.register(createUserDto);
  }
}

export default AuthService;
