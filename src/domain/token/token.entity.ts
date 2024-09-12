import { IsString, IsNumber } from 'class-validator';

export class TokenEntity {
  @IsNumber()
  id: number;

  @IsString()
  token: string;

  @IsNumber()
  expiryDate: string;
}
