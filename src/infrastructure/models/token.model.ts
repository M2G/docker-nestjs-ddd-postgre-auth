import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Token extends Model {
  @Column
  id: number;

  @Column
  token: string;

  @Column
  expiryDate: string;
}
