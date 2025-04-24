import { IsString } from 'class-validator';

class LoginDto {
  @IsString()
  password: string;

  @IsString()
  email: string;
}

export default LoginDto;
