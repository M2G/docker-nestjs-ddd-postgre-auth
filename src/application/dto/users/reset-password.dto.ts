import { IsString } from 'class-validator';

class ResetPasswordDTO {
  @IsString()
  password: string;

  @IsString()
  reset_password_token: string | null;

  @IsString()
  token: string;
}

export default ResetPasswordDTO;
