import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import CreateUserDto from '@application/dto/users';
import User from '@infrastructure/models/user.model';

@Injectable()
class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async authenticate({ email }: { email: string }): Promise<unknown | null> {
    try {
      const user = await this.userModel.findOne({ where: { email } }, { raw: true });

      console.log('authenticate', user);
      if (!user) return null;
      return user;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  /*
    findOne(id: number): Promise<User> {}
    changePassword(): Promise<User[]> {}
    forgotPassword(): Promise<User[]> {}
    resetPassword(): Promise<User[]> {}
    register(): Promise<User[]> {}
    authenticate(): Promise<User[]> {}
    async update(id: number, updateUserDto: any): Promise<User[]> {}

     */
}

export default UsersService;
