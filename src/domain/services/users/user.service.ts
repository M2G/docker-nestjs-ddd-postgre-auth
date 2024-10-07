import { Injectable, Inject } from '@nestjs/common';
import CreateUserDto from '@application/dto/users/user.dto';
import UserRepository from '@infrastructure/repository/user/user.repository';
import { InjectModel } from '@nestjs/sequelize';
import User from '@infrastructure/repository/user';

// Se inyecta el repo en el servicio
@Injectable()
class UserService {
  constructor(private readonly repository: UserRepository) {}

  /*
  getHello(): string {
    return 'Hello World!';
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.repository.create(createUserDto);
  }
*/
  find({ ...args }: { args: any }): any {
    return this.repository.find({ ...args } as any);
  }

  authenticate({ ...args }: { args: any }): any {
    return this.repository.authenticate({ ...args } as any);
  }

  changePassword({ ...args }: { args: any }): any {
    return this.repository.changePassword({ ...args } as any);
  }

  findOne({ ...args }: { args: any }): any {
    return this.repository.findOne({ ...args } as any);
  }

  forgotPassword({ ...args }: { args: any }): any {
    return this.repository.forgotPassword({ ...args } as any);
  }

  register({ ...args }: { args: any }): any {
    return this.repository.register({ ...args } as any);
  }

  remove({ ...args }: { args: any }): any {
    return this.repository.remove({ ...args } as any);
  }

  resetPassword({ ...args }: { args: any }): any {
    return this.repository.resetPassword({ ...args } as any);
  }

  update({ ...args }: { args: any }): any {
    return this.repository.update({ ...args } as any);
  }

  /*
   authenticate,
    changePassword,
    findOne,
    forgotPassword,
    getAll,
    register,
    remove,
    resetPassword,
    update,
   */
}

export default UserService;
