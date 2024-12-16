import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UniqueConstraintError } from 'sequelize';
import { User as UserModel, Token as TokenModel } from '@infrastructure/models';
import { TokenEntity as Token, UserEntity as User } from '@domain/entities';
import { YcI18nService } from '@domain/services';
import { CreateUserDto } from '@application/dto/users';
import config from '@config';

export interface ITokenRepository {
  register: (createUserDto: CreateUserDto) => Promise<User | null>;
  refreshToken: (requestToken: {
    requestToken: string;
  }) => Promise<{ accessToken: string; refreshToken?: string | null }>;
}

@Injectable()
class TokenRepository implements ITokenRepository {
  constructor(
    @InjectModel(UserModel)
    @InjectModel(TokenModel)
    private readonly userModel: typeof UserModel,
    private readonly tokenModel: typeof TokenModel,
    private readonly jwtService: JwtService,
    private readonly i18n: YcI18nService,
  ) {}

  verifyExpiration({ expiryDate }: { expiryDate: number }): boolean {
    return expiryDate < new Date().getTime();
  }

  register({ created_at, deleted_at, email, password }: CreateUserDto): any {
    try {
      return this.userModel.create(
        {
          created_at,
          deleted_at,
          email,
          password,
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

  async refreshToken({
    requestToken,
  }: {
    requestToken: string;
  }): Promise<{ accessToken: string; refreshToken?: string | null }> {
    try {
      const refreshToken = await this.tokenModel.findOne({
        where: { token: requestToken },
      });

      if (this.verifyExpiration(refreshToken as unknown as Token)) {
        await this.userModel.destroy({ where: { id: refreshToken?.id } });
        throw new Error(this.i18n.t('errors.refreshToken') as string);
      }

      const user = await this.tokenModel.findOne({ where: { id: refreshToken?.id } });

      const payload = {
        id: user?.id,
      };

      const options = {
        audience: [],
        expiresIn: config.jwtExpiration,
        subject: user?.id?.toString(),
      };

      const newAccessToken = this.jwtService.sign(payload, options);

      return {
        accessToken: newAccessToken,
        refreshToken: refreshToken?.token,
      };
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }
}

export default TokenRepository;
