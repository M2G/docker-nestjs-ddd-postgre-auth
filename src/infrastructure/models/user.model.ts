import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
class User extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number;

  @Column
  email: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  name: string;

  @Column
  username: string;

  @Column
  password: string;

  @Column
  oldPassword: string;

  @Column
  createdAt: Date;

  @Column
  deletedAt: Date;

  @Column
  modifiedAt: Date;

  @Column
  lastConnectedAt: number;

  @Column
  resetPasswordExpires: number;

  @Column
  resetPasswordToken: string;
}

export default User;
