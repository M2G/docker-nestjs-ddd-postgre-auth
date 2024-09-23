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

  async create(createUserDto: CreateUserDto): Promise<User> {}
  findAll({
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

      const currPage = +page || 1;

      const data = await this.userModel.findAll({
        ...query,
        attributes,
        raw: true,
        nest: true,
        limit: pageSize,
        offset: pageSize * (currPage - 1),
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
      };
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }
  findOne(id: number): Promise<User> {}
  changePassword(): Promise<User[]> {}
  forgotPassword(): Promise<User[]> {}
  resetPassword(): Promise<User[]> {}
  register(): Promise<User[]> {}
  authenticate(): Promise<User[]> {}
  async update(id: number, updateUserDto: any): Promise<User[]> {}
}

export default UsersService;
