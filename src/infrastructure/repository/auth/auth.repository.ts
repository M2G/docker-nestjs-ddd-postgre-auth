import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UniqueConstraintError } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '@infrastructure/models';
import { encryptPassword, validatePassword } from '@encryption';
import { RedisService } from '@domain/services';
import { IAuthRepository } from '@domain/interfaces';
import config from '@config';
import { CreateUserDto, LoginDto } from '@application/dto';

@Injectable()
class AuthRepository implements IAuthRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => RedisService))
    private readonly redisService: RedisService,
    // private readonly i18n: YcI18nService,
  ) {}

  login({ id, email }: { id: number } & LoginDto): { accessToken: string } {
    if (id) this.redisService.saveLastUserConnected(id);
    const payload = { email, id };
    const options = { expiresIn: '120s', secret: config.authSecret };
    return { accessToken: this.jwtService.sign(payload, options) };
  }

  async validateUser({ email, password }: LoginDto): Promise<User | null | any> {
    try {
      const user = await this.userModel.findOne({ raw: true, where: { email } });
      /*
      if (!user) {
        throw new BadRequestException(
          this.i18n.t('users.notFound', {
            args: { id: email },
          }) as string,
        );
      }
      */
      const isMatch = user?.password && bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Password does not match');
      }
      return user;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async register({ email, password }: CreateUserDto): Promise<{ accessToken: string }> {
    try {
      const hashPassword = encryptPassword(password as string);
      const user = await this.userModel.create(
        {
          created_at: new Date(Date.now()).toISOString(),
          email,
          password: hashPassword,
        },
        { raw: true },
      );
      return this.login({
        email,
        id: user.id,
      } as { id: number } & LoginDto);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException({ message: 'Duplicate error' });
      }
      throw new Error(error as string | undefined);
    }
  }
}

export default AuthRepository;
