import { User } from '@infrastructure/models';
import { CreateUserDto, UpdateUserDto } from '@application/dto';

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
  findOne: ({ id }: { id: number }) => Promise<User | null>;
  forgotPassword: ({ email }: { email: string }) => Promise<User | null>;
  register: (createUserDto: CreateUserDto) => User;
  resetPassword: ({
    password,
    reset_password_token,
  }: {
    password: string;
    reset_password_token: string;
  }) => Promise<User | null>;
  changePassword: ({
    id,
    password,
    old_password,
  }: {
    id: number;
    password: string;
    old_password: string;
  }) => Promise<User | null>;
  update: (updateUserDto: UpdateUserDto) => User | null;
  remove: ({ id }: { id: number }) => Promise<boolean>;
}

export default IUserRepository;
