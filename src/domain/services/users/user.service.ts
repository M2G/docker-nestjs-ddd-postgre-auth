import { Injectable, Inject } from '@nestjs/common';
import User from '@domain/entities/user';
import CreateUserDto from '@application/dto/users/user.dto';
import UserRepository from '@infrastructure/repository/user/user.repository';

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
  find({ ...args }: { args: any }): Promise<User[]> {
    return this.repository.find({ ...args });
  }
}
