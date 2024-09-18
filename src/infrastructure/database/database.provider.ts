import { Sequelize } from 'sequelize-typescript';
import { User, Token } from '../models';

const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    async useFactory() {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'postgres',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'test_db',
      });
      sequelize.addModels([User, Token]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

export default databaseProviders;
