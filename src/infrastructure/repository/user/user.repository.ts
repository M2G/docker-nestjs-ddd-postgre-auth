import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UniqueConstraintError, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import CreateUserDto from '@application/dto/users';
import User from '@infrastructure/models/user.model';
import { encryptPassword, validatePassword } from '@encryption';

@Injectable()
class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  // async create(createUserDto: CreateUserDto): Promise<User> {}

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

      const currPage = Number(page) || 1;

      const data = await this.userModel.findAll({
        ...query,
        attributes,
        limit: pageSize,
        nest: true,
        offset: pageSize * (currPage - 1),
        raw: true,
      });

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

  async register({
    created_at,
    email,
    password,
    deleted_at,
  }: {
    created_at: number;
    deleted_at: number;
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const { dataValues } = await this.userModel.create({
        created_at,
        deleted_at,
        email,
        password,
      });

      return { ...dataValues };
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new Error('Duplicate error');
      }

      throw new Error(error as string | undefined);
    }
  }

  async changePassword({
    id,
    password,
    oldPassword,
  }: {
    id: number;
    password: string;
    oldPassword: string;
  }): Promise<unknown> {
    try {
      const dataValues = await this.userModel.findOne(
        { where: { id } },
        //  , { raw: true }
      );

      if (
        dataValues?.dataValues?.password &&
        validatePassword(dataValues.dataValues.password)(oldPassword)
      ) {
        const hashPassword = encryptPassword(password);
        return this.update({ id, password: hashPassword });
      }

      return null;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async forgotPassword({ email }: { email: string }): Promise<unknown> {
    try {
      const data = await this.userModel.findOne(
        { where: { email } },
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
      });
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
  }): Promise<unknown | null> {
    try {
      const dataValues = await this.userModel.findOne(
        {
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

  async findOne({ id }: { id: number }): Promise<unknown | null> {
    try {
      const data = await this.userModel.findByPk(id, { raw: true });
      if (!data) return null;
      return { ...data };
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  remove({ id }: { id: number }): any {
    try {
      return this.userModel.destroy({ where: { id } });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  update({ id, ...params }: { id: number; params: User }): unknown | null {
    try {
      return this.userModel.update(
        { ...params },
        { where: { id } },
        // , { raw: true }
      );
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async authenticate({ email }: { email: string }): Promise<unknown | null> {
    try {
      const user = await this.userModel.findOne(
        { where: { email } },
        //  , { raw: true }
      );

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
