import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UniqueConstraintError, Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '@infrastructure/models';
import { encryptPassword, validatePassword } from '@encryption';
import { CreateUserDto, UpdateUserDto } from '@application/dto/users';
import updateUserDto from '@application/dto/users/update-user.dto';
import { RedisService, YcI18nService } from '@domain/services';
import config from '@config';

export interface IAuthRepository {}

@Injectable()
class AuthRepository implements IAuthRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => RedisService))
    private readonly redisService: RedisService,
    private readonly i18n: YcI18nService,
  ) {}

  async login(user: User): Promise<{ accessToken: string }> {
    await this.redisService.saveLastUserConnected(user?.id);
    const payload = { email: user.email, id: user.id };
    const options = { secret: config.authSecret };
    return { accessToken: this.jwtService.sign(payload, { secret: config.authSecret }) };
  }

  async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ raw: true, where: { email } });
      if (!user) {
        throw new BadRequestException(
          this.i18n.t('users.notFound', {
            args: { id: email },
          }) as string,
        );
      }
      const isMatch: boolean = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Password does not match');
      }
      return user;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async register({
    created_at,
    modified_at,
    email,
    password,
  }: CreateUserDto): Promise<{ accessToken: string }> {
    try {
      const hashPassword = encryptPassword(password);
      const user = (await this.userModel.create(
        {
          created_at,
          modified_at,
          email,
          password: hashPassword,
        },
        { raw: true },
      )) as any;
      return this.login({
        email,
        id: user.id,
      } as User);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException({ message: 'Duplicate error' });
      }
      throw new Error(error as string | undefined);
    }
  }
}

export default AuthRepository;
