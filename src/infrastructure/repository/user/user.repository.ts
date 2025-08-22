import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UniqueConstraintError, Op } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { User as UserModel } from '@infrastructure/models';
import { UserEntity as User } from '@domain/entities';
import { encryptPassword, validatePassword } from '@encryption';
//import { RedisService, MailService } from '@domain/services';
//import { RedisService } from '@domain/services';
import { IUserRepository, UserTypeResultData } from '@domain/interfaces';
import RedisService from '@domain/services/cache/redis.service';
import MailService from '@domain/services/mail/mail.service';
import {
  AuthenticateDto,
  CreateUserDto,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  UpdateUserDto,
} from '@application/dto';
import ChangePasswordDto from '@application/dto/users/change-password.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
class UsersRepository implements IUserRepository {
  private readonly logger = new Logger();

  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => RedisService))
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    private readonly i18n: I18nService
  ) {}

  async find({
    filters,
    pageSize,
    page,
  }: {
    filters: string;
    pageSize: number;
    page: number;
  }): Promise<{
    pageInfo: {
      count: number;
      next: number | null;
      pages: number;
      prev: number | null;
    },
    results: UserTypeResultData[];
  }> {
    try {
      const query: {
        where: {
          deleted_at: number;
          [Op.or]?: [
            {
              email: {
                [Op.like]: string;
              };
            },
            {
              first_name: {
                [Op.like]: string;
              };
            },
            {
              last_name: {
                [Op.like]: string;
              };
            },
          ];
        };
      } = {
        where: {
          deleted_at: 0,
        },
      };

      if (filters) {
        query.where = {
          deleted_at: 0,
          [Op.or]: [
            {
              email: {
                [Op.like]: `%${filters}%`,
              },
            },
            {
              first_name: {
                [Op.like]: `%${filters}%`,
              },
            },
            {
              last_name: {
                [Op.like]: `%${filters}%`,
              },
            },
          ],
        };
      }

      console.log('query query query', query);

      if (!filters) {
       const cachingUserList = await this.redisService.findUsers();
       console.log('cachingUserList cachingUserList cachingUserList', cachingUserList);
        if (cachingUserList) {
          return {
            pageInfo: {
              count: 1,
              next: null,
              pages: 1,
              prev: null,
            },
            results: JSON.parse(cachingUserList),
          };
        }
      }

      const currPage = Number(page) || 1;

      const data = await this.userModel.findAll({
        ...query,
        attributes: ['id', 'email', 'first_name', 'last_name', 'created_at', 'modified_at'],
        limit: pageSize,
        nest: true,
        offset: pageSize * (currPage - 1),
        raw: true,
      });

     data?.length && this.redisService.saveUsers(data as User[]);

      const pages = Math.ceil(data.length / pageSize);
      const prev = currPage > 1 ? currPage - 1 : null;
      const next = pages < currPage ? currPage + 1 : null;

      return {
        pageInfo: {
          count: data.length,
          next,
          pages,
          prev,
        },
        results: data?.length ? data : [],
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
    const cachingUser = await this.redisService.findUser(String(id));
    if (cachingUser) return cachingUser as unknown as User;

      const data = await this.userModel.findByPk(id, { raw: true });
      if (!data) return null;
     this.redisService.saveUser(data as unknown as User);
      return data as unknown as User;
    } catch (error) {
      throw error;
    }
  }

  async register({ email, password }: CreateUserDto): Promise<boolean> {
    try {
      const hashPassword = encryptPassword(password);

      const user = await this.userModel.create(
        {
          created_at: new Date(Date.now()).toISOString(),
          email,
          password: hashPassword,
        },
        { raw: true },
      ) as any;

      return !!user;

    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new Error(
          this.i18n.t('users.duplicateEmail', {
            args: { email },
          }),
        );
      }

      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const ok = await this.userModel.destroy({ where: { id } });
     void this.redisService.removeUser(id);
      return !!ok;
    } catch (error) {
      throw error;
    }
  }

  async authenticate(email: AuthenticateDto): Promise<User | null> {
    try {
      const dataValues = await this.userModel.findOne({ raw: true, where: { email } });
      if (!dataValues) return null;
      return dataValues as unknown as User;
    } catch (error) {
      throw error;
    }
  }

  async changePassword({
    id,
    password,
    old_password,
  }: {
    id: number;
  } & ChangePasswordDto): Promise<boolean | null> {

    console.log("changePassword", {
      id,
      password,
      old_password,
    });

    try {
      const user = await this.userModel.findOne({ raw: true, where: { id } });

      if (user?.password && !validatePassword(user.password)(old_password))
        throw new BadRequestException(this.i18n.t('users.passwordNotMatch'));

        const hashPassword = encryptPassword(password);
        return this.update({ id, password: hashPassword } as never);

    } catch (error) {
      throw error;
    }
  }

  async forgotPassword({ email }: ForgotPasswordDTO): Promise<boolean | null> {
    console.log('data', email);
    try {
      const data = await this.userModel.findOne({ raw: true, where: { email } });

      if (!data) return null;

      const payload = {
        email: data.email,
        id: data.id,
        password: data.password,
      };
      const options = {
        audience: [],
       expiresIn: this.configService.get<string>('JWT_TOKEN_EXPIRE_TIME'),
       secret: this.configService.get<string>('SECRET'),
        subject: data.email,
      };

     const token = await this.jwtService.signAsync(payload, options);

     console.log('token', token);

      const mail = {
        from: 'Kingsley Okure',
        subject: `Password help has arrived!`,
        text: `http://localhost:3002/reset-password?token=${token}`,
        to: 'joanna@gmail.com',
      };

      const mailOption: any = await this.mailService.send(mail);

      this.logger.log(mailOption.messageId);

      return this.update({
        id: data.id,
        reset_password_expires: new Date(Date.now() + 86400000).toISOString(),
        reset_password_token: token,
      } as never);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword({
    password,
    reset_password_token,
  }: ResetPasswordDTO): Promise<boolean | null> {
    try {
      const dataValues = await this.userModel.findOne({
        raw: true,
        where: {
          reset_password_expires: {
            [Op.gt]: new Date(Date.now()).toISOString(),
          },
          reset_password_token,
        },
      });

      if (!dataValues) return null;

      dataValues.password = encryptPassword(password);
      dataValues.reset_password_token = null;
      dataValues.reset_password_expires = new Date(Date.now()).toISOString();

      return this.update(dataValues as unknown as { id: number } & UpdateUserDto);
    } catch (error) {
      throw error;
    }
  }

  async update({ id, ...params }: { id: number } & UpdateUserDto): Promise<boolean> {
    try {
      const [ok] = await this.userModel.update({ ...params }, {
        where: { id },
      } as never);
      return !!ok;
    } catch (error) {
      throw error;
    }
  }
}

export default UsersRepository;
