import { IsString, IsNumber } from 'class-validator';

class LoginDto {
  @IsNumber()
  username: number;

  @IsString()
  password: string;
}

export default LoginDto;
