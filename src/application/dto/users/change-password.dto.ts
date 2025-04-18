import { IsString, IsDate, IsNumber } from 'class-validator';

class CreateUserEntity {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  old_password: string;

  @IsDate()
  created_at: Date;

  @IsDate()
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

export default CreateUserEntity;
