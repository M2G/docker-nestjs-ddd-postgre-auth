import { IsString } from 'class-validator';

class CreateUserEntity {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export default CreateUserEntity;
