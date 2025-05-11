import { IsString, IsOptional } from 'class-validator';

class UpdateUserEntity {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  password: string;
}

export default UpdateUserEntity;
