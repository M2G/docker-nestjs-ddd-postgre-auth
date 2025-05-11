import { IsString } from 'class-validator';

class ChangePasswordEntity {
  @IsString()
  password: string;

  @IsString()
  old_password: string;
}

export default ChangePasswordEntity;
