import { IsString, IsDate, IsNumber } from 'class-validator';

/*
created_at
deleted_at
email
first_name
id
last_connected_at
last_name
modified_at
password
oldPassword
reset_password_expires
reset_password_token
username
 */

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
