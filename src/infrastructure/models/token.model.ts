import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'tokens', timestamps: false })
class Token extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number;

  @Column
  token: string;

  @Column
  expiryDate: string;
}

export default Token;
