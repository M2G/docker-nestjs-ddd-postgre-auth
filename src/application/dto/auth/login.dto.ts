import { IsString } from 'class-validator';

class LoginDto {
  @IsString()
  password?: string;

  @IsString()
  username: string;
}

export default LoginDto;
