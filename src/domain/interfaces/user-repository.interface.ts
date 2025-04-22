import type { UserEntity as User } from '@domain/entities';
import {
  ForgotPasswordDTO,
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDTO,
  ResetPasswordDTO,
  AuthenticateDto,
} from '@application/dto';

interface IUserRepository {
  authenticate: (email: AuthenticateDto) => Promise<User | null>;
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
  forgotPassword: (email: ForgotPasswordDTO) => Promise<boolean | null>;
  register: (createUser: CreateUserDto) => Promise<User>;
  resetPassword: ({ password, reset_password_token }: ResetPasswordDTO) => Promise<boolean | null>;
  changePassword: ({
    id,
    password,
    old_password,
  }: {
    old_password: string;
  } & ChangePasswordDTO) => Promise<boolean | null>;
  update: (updateUser: UpdateUserDto) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
}

export default IUserRepository;
