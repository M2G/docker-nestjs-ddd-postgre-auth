import type { UserEntity as User } from '@domain/entities';

interface IAuthRepository {
  login: (user: User) => Promise<{ accessToken: string }>;
  register: ({
    created_at,
    modified_at,
    email,
    password,
  }: User) => Promise<{ accessToken: string }>;
  validateUser: ({ email, password }: User) => Promise<User | null>;
}

export default IAuthRepository;
