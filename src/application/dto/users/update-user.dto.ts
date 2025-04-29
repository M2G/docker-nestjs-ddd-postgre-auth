import { IsString, IsNumber } from 'class-validator';

class UpdateUserEntity {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  password: string;
}

export default UpdateUserEntity;
