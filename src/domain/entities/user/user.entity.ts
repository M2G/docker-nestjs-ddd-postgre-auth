import { IsString, IsDate, IsNumber } from 'class-validator';

class UserEntity {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  first_name: string | null;

  @IsString()
  last_name: string | null;

  @IsString()
  password: string;

  @IsString()
  old_password: string | null;

  @IsDate()
  created_at: Date;

  @IsNumber()
  deleted_at: number;

  @IsDate()
  modified_at: Date;

  @IsNumber()
  last_connected_at: number;

  @IsString()
  reset_password_expires: string;

  @IsString()
  reset_password_token: string | null;
}

export default UserEntity;
