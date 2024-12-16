import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
class User extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number;

  @Column
  email: string;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @Column
  password: string;

  @Column
  old_password: string;

  @Column
  created_at: Date;

  @Column
  deleted_at: number;

  @Column
  modified_at: Date;

  @Column
  last_connected_at: number;

  @Column
  reset_password_expires: number;

  @Column({ type: DataType.STRING })
  reset_password_token?: string | null;
}

export default User;
