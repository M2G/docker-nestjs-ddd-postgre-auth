import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forRoot({
            retryAttempts: 3,
            retryDelay: 3000,
            dialect: 'postgres',
            host: 'postgres',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'test_db',
            models: [],
        }),
    ],
})
export class DatabaseModule {}
