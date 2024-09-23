import { IsString, IsNumber } from 'class-validator';

class TokenDto {
  @IsNumber()
  id: number;

  @IsString()
  token: string;

  @IsNumber()
  expiryDate: string;
}

export default TokenDto;
