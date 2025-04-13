import type { UserEntity as User } from '@domain/entities';
import { ForgotPasswordDTO, CreateUserDto, UpdateUserDto } from '@application/dto';

interface IUserRepository {
  authenticate: ({ email }: User) => Promise<User | null>;
  find: ({
    filters,
    pageSize,
    page,
    attributes,
  }: {
    filters: string;
    pageSize: number;
    page: number;
    attributes: string[] | undefined;
  }) => Promise<User[]>;
  findOne: (id: number) => Promise<User | null>;
  forgotPassword: (email: ForgotPasswordDTO) => Promise<User | null>;
  register: (createUser: CreateUserDto) => Promise<User>;
  resetPassword: ({ password, reset_password_token }: User) => Promise<unknown>;
  changePassword: ({
    id,
    password,
    old_password,
  }: {
    old_password: string;
  } & User) => Promise<User | null>;
  update: (updateUser: UpdateUserDto) => Promise<User[]> | null;
  remove: (id: number) => Promise<boolean>;
}

export default IUserRepository;
