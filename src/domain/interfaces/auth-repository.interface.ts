import type { UserEntity as User } from '@domain/entities';
import type { CreateUserDto, LoginDto } from '@application/dto';

interface IAuthRepository {
  login: (loginUser: { id: number } & LoginDto) => { accessToken: string };
  register: (registerUser: CreateUserDto) => Promise<{ accessToken: string }>;
  validateUser: (validateUser: LoginDto) => Promise<User | null>;
}

export default IAuthRepository;
