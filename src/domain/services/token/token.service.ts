import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TokenRepository } from '@infrastructure/repository';

@Injectable()
class TokenService {
  constructor(
    @Inject(forwardRef(() => TokenRepository)) private readonly tokenRepository: TokenRepository,
  ) {}

  async refreshToken(requestToken: {
    requestToken: string;
  }): Promise<{ accessToken: string; refreshToken?: string | null }> {
    return this.tokenRepository.refreshToken(requestToken);
  }
}

export default TokenService;
