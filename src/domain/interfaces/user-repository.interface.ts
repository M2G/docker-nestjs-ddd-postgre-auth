import { PartialType, OmitType } from '@nestjs/mapped-types';
import type { UserEntity as User } from '@domain/entities';
import { UserEntity as UserType } from '@domain/entities';
import type {
  ForgotPasswordDTO,
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDTO,
  ResetPasswordDTO,
  AuthenticateDto,
} from '@application/dto';

export class UserTypeResultData extends PartialType(
  OmitType(UserType, [
    'id',
    'email',
    'first_name',
    'last_name',
    'created_at',
    'modified_at',
  ] as const),
) {}

interface IUserRepository {
  authenticate: (email: AuthenticateDto) => Promise<User | null>;
  find: ({
    filters,
    pageSize,
    page,
  }: {
    filters: string;
    pageSize: number;
    page: number;
  }) => Promise<{
    pageInfo: {
      count: number;
      next: number | null;
      pages: number;
      prev: number | null;
    };
    results: UserTypeResultData[];
  }>;
  findOne: (id: number) => Promise<User | null>;
  forgotPassword: (email: ForgotPasswordDTO) => Promise<boolean | null>;
  register: (createUser: CreateUserDto) => Promise<User>;
  resetPassword: ({ password, reset_password_token }: ResetPasswordDTO) => Promise<boolean | null>;
  changePassword: ({
    id,
    password,
    old_password,
  }: {
    id: number;
  } & ChangePasswordDTO) => Promise<boolean | null>;
  update: (updateUser: UpdateUserDto) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
}

export default IUserRepository;
