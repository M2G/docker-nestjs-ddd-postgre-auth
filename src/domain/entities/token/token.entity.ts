import { IsString, IsNumber } from 'class-validator';

class TokenEntity {
  @IsNumber()
  id: number;

  @IsString()
  token: string;

  @IsNumber()
  expiryDate: number;
}

export default TokenEntity;
