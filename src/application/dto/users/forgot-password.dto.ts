import { IsEmail, IsString } from 'class-validator';

class ForgotPasswordDTO {
  @IsString()
  @IsEmail()
  email: string;
}

export default ForgotPasswordDTO;
