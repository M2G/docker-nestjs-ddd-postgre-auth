import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UniqueConstraintError, Op } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { User as UserModel } from '@infrastructure/models';
import { UserEntity as User } from '@domain/entities';
import { encryptPassword, validatePassword } from '@encryption';
import { RedisService, YcI18nService, MailService } from '@domain/services';
import { IUserRepository } from '@domain/interfaces';
import {
  AuthenticateDto,
  CreateUserDto,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  UpdateUserDto,
} from '@application/dto';
import ChangePasswordDto from '@application/dto/users/change-password.dto';

@Injectable()
class UsersRepository implements IUserRepository {
  private readonly logger = new Logger();

  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly i18n: YcI18nService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async find({
    filters,
    pageSize,
    page,
    attributes,
  }: {
    filters: string;
    pageSize: number;
    page: number;
    attributes: string[] | undefined;
  }): Promise<User[]> {
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
      console.log('attributes attributes attributes', attributes);

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
          } as any;
        }
      }

      const currPage = Number(page) || 1;

      const data = await this.userModel.findAll({
        ...query,
        attributes,
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
      } as any;
    } catch (error) {
      throw new Error(error as string | undefined);
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
      throw new Error(error as string | undefined);
    }
  }

  register({ created_at, deleted_at, email, password }: CreateUserDto): Promise<User> {
    try {
      const hashPassword = encryptPassword(password);
      return this.userModel.create(
        {
          created_at,
          deleted_at,
          email,
          password: hashPassword,
        },
        { raw: true },
      ) as any;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new Error(
          this.i18n.t('users.duplicateEmail', {
            args: { email },
          }) as string,
        );
      }

      throw new Error(error as string | undefined);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const ok = await this.userModel.destroy({ where: { id } });
      void this.redisService.removeUser(id);
      return !!ok;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async authenticate(email: AuthenticateDto): Promise<User | null> {
    try {
      const dataValues = await this.userModel.findOne({ raw: true, where: { email } });
      if (!dataValues) return null;
      return dataValues as unknown as User;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async changePassword({
    id,
    password,
    old_password,
  }: {
    old_password: string;
  } & ChangePasswordDto): Promise<boolean | null> {
    try {
      const dataValues = await this.userModel.findOne({ raw: true, where: { id } });

      if (
        dataValues?.dataValues?.password &&
        validatePassword(dataValues.dataValues.password)(old_password)
      ) {
        const hashPassword = encryptPassword(password);
        return this.update({ id, password: hashPassword } as never);
      }

      return null;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async forgotPassword(email: ForgotPasswordDTO): Promise<boolean | null> {
    try {
      const data = await this.userModel.findOne({ raw: true, where: { email } });

      console.log('data', data);

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

      console.log('this.jwtService', this.jwtService);

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
      throw new Error(error as string | undefined);
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

      return this.update(dataValues as unknown as UpdateUserDto);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async update({ id, ...params }: UpdateUserDto): Promise<boolean> {
    try {
      const [ok] = await this.userModel.update({ ...params }, {
        where: { id },
      } as never);
      return !!ok;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }
}

export default UsersRepository;
