import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { mockService } from '../../../mocks';
import { TokenService } from '@domain/services';
import { TokenRepository } from '@infrastructure/repository';

const oneDayInSeconds = 60;

describe('YcI18nService', () => {
  let testingModule: TestingModule;
  let tokenService: TokenService;

  const tokenServiceMock: MockProxy<TokenRepository> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [mockService(TokenService, tokenServiceMock)],
    }).compile();

    tokenService = testingModule.get<TokenRepository>(TokenService) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  it('should successfully find user', async function () {
    tokenServiceMock.refreshToken.mockResolvedValue({
      accessToken: 'test',
      refreshToken: 'test',
    });
    const result = await tokenService.refreshToken({
      requestToken: 'test',
    });

    console.log('result', result);

    expect(result).toEqual({
      accessToken: 'test',
      refreshToken: 'test',
    });
    expect(tokenServiceMock.refreshToken).toHaveBeenCalledTimes(1);
    expect(tokenServiceMock.refreshToken).toHaveBeenCalledWith({
      requestToken: 'test',
    });
  });
});
