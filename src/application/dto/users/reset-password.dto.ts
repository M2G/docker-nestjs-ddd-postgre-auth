import { IsString } from 'class-validator';

class ResetPasswordDTO {
  @IsString()
  password: string;

  @IsString()
  reset_password_token: string | null;
}

export default ResetPasswordDTO;
