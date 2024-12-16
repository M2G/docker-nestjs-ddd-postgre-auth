import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UniqueConstraintError, Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { User } from '@infrastructure/models';
import { encryptPassword, validatePassword } from '@encryption';
import { CreateUserDto, UpdateUserDto } from '@application/dto/users';
import updateUserDto from '@application/dto/users/update-user.dto';
import { RedisService } from '@domain/services';

export interface IUserRepository {
  authenticate: ({ email }: User) => Promise<User | null>;
  find: ({
    filters,
    pageSize,
    page,
    attributes,
  }: {
    filters: string;
    pageSize: number;
    page: number;
    attributes: string[] | undefined;
  }) => Promise<User[]>;
  findOne: ({ id }: { id: number }) => Promise<User | null>;
  forgotPassword: ({ email }: { email: string }) => Promise<User | null>;
  register: (createUserDto: CreateUserDto) => User;
  resetPassword: ({
    password,
    reset_password_token,
  }: {
    password: string;
    reset_password_token: string;
  }) => Promise<User | null>;
  changePassword: ({
    id,
    password,
    old_password,
  }: {
    id: number;
    password: string;
    old_password: string;
  }) => Promise<User | null>;
  update: (updateUserDto: UpdateUserDto) => Promise<User | null>;
  remove: ({ id }: { id: number }) => Promise<boolean>;
}

@Injectable()
class UsersRepository implements IUserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => RedisService))
    private readonly redisService: RedisService,
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
        if (cachingUserList) return cachingUserList as unknown as User[];
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

      console.log('DATA', data);

      void this.redisService.saveUsers(data as any);

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
        results: data?.length ? data.map((d) => ({ ...d })) : [],
      } as any;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async findOne({ id }: { id: number }): Promise<User | null> {
    try {
      const cachingUser = await this.redisService.findUser(id as any);
      if (cachingUser) return cachingUser as unknown as User;

      const data = await this.userModel.findByPk(id, { raw: true });
      void this.redisService.saveUser(data as any);
      return data;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  register({ created_at, deleted_at, email, password }: CreateUserDto): User {
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
        throw new Error('Duplicate error');
      }

      throw new Error(error as string | undefined);
    }
  }

  async remove({ id }: { id: number }): Promise<boolean> {
    console.log('id', id);
    try {
      const ok = await this.userModel.destroy({ where: { id } });
      void this.redisService.removeUser(id);
      return !!ok;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async authenticate({ email }: { email: string }): Promise<any | null> {
    try {
      return this.userModel.findOne({ raw: true, where: { email } });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async changePassword({
    id,
    password,
    old_password,
  }: {
    id: number;
    password: string;
    old_password: string;
  }): Promise<User | null> {
    try {
      const dataValues = await this.userModel.findOne(
        { raw: true, where: { id } },
        //  , { raw: true }
      );

      if (
        dataValues?.dataValues?.password &&
        validatePassword(dataValues.dataValues.password)(old_password)
      ) {
        const hashPassword = encryptPassword(password);
        return this.update({ id, password: hashPassword } as UpdateUserDto);
      }

      return null;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async forgotPassword({ email }: { email: string }): Promise<User | null> {
    try {
      const data = await this.userModel.findOne(
        { raw: true, where: { email } },
        //  , { raw: true }
      );

      if (!data?.dataValues) return null;

      const payload = {
        email: data?.dataValues.email,
        id: data?.dataValues.id,
        password: data?.dataValues.password,
      };
      const options = {
        audience: [],
        expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME,
        subject: data?.dataValues.email,
      };

      const token: string = this.jwtService.sign(payload, options);

      return this.update({
        id: data?.dataValues.id,
        reset_password_expires: Date.now() + 86400000,
        reset_password_token: token,
      } as updateUserDto);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async resetPassword({
    password,
    reset_password_token,
  }: {
    password: string;
    reset_password_token: string;
  }): Promise<User | null> {
    try {
      const dataValues: User | null = await this.userModel.findOne(
        {
          raw: true,
          where: {
            reset_password_expires: {
              [Op.gt]: Date.now(),
            },
            reset_password_token,
          },
        },
        // { raw: true },
      );

      if (!dataValues) return null;

      dataValues.password = password;
      dataValues.reset_password_token = null;
      dataValues.reset_password_expires = Date.now();

      return this.update({ ...dataValues } as any);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  update({ id, ...params }: UpdateUserDto): Promise<User | null> {
    try {
      return this.userModel.update(
        { ...params },
        {
          // raw: true,
          where: { id },
        },
      ) as any;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }
}

export default UsersRepository;
