import { IsString, IsDate, IsNumber, IsEmpty } from 'class-validator';

class UserEntity {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  oldPassword: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  deletedAt: Date;

  @IsDate()
  modifiedAt: Date;

  @IsNumber()
  lastConnectedAt: number;

  @IsNumber()
  resetPasswordExpires: number;

  @IsString()
  resetPasswordToken: string;
}

export default UserEntity;
