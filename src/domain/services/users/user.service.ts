import { Injectable, Inject } from '@nestjs/common';
import CreateUserDto from '@application/dto/users/user.dto';
import UserRepository from '@infrastructure/repository/user/user.repository';
import { InjectModel } from '@nestjs/sequelize';
import User from '@infrastructure/repository/user';

// Se inyecta el repo en el servicio
@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  /*
  getHello(): string {
    return 'Hello World!';
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.repository.create(createUserDto);
  }
*/
  find({ ...args }: { args: any }): Promise<any[]> {
    return this.repository.find({ ...args } as any);
  }
}
