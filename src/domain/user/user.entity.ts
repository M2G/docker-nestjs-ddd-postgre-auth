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

export class UserEntity {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  oldPassword: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  deleted_at: Date;

  @IsDate()
  modified_at: Date;

  @IsNumber()
  last_connected_at: number;

  @IsNumber()
  reset_password_expires: number;

  @IsString()
  reset_password_token: string;
}
