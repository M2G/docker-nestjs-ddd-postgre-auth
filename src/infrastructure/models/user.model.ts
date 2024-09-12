import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  id: number;

  @Column
  email: string;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @Column
  name: string;

  @Column
  username: string;

  @Column
  password: string;

  @Column
  oldPassword: string;

  @Column
  created_at: Date;

  @Column
  deleted_at: Date;

  @Column
  modified_at: Date;

  @Column
  last_connected_at: number;

  @Column
  reset_password_expires: number;

  @Column
  reset_password_token: string;
}
