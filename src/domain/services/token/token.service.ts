import { Injectable } from '@nestjs/common';
import TokenRepository from '@infrastructure/repository/token';

@Injectable()
class TokenService {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async refreshToken(requestToken: { requestToken: string }): Promise<any> {
    return this.tokenRepository.refreshToken(requestToken);
  }
}

export default TokenService;
