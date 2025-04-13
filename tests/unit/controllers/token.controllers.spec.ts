import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { TokenService } from '@domain/services';
import { mockService } from 'tests/mocks';
import { TokenControllers } from '@application/controllers';

describe('Refresh token', () => {
  let testingModule: TestingModule;
  let tokenControllers: TokenControllers;
  const tokenServiceMock: MockProxy<TokenService> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [TokenControllers],
      imports: [],
      providers: [mockService(TokenService, tokenServiceMock as any)],
    }).compile();

    tokenControllers = testingModule.get<TokenControllers>(TokenControllers) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should successfully register user', async () => {
    tokenServiceMock.refreshToken.mockResolvedValue({ requestToken: 'test' });
    const data = await tokenControllers.refreshToken({
      accessToken: 'test',
      refreshToken: 'test',
    });

    expect(tokenServiceMock.refreshToken).toHaveBeenCalledTimes(1);
    expect(tokenServiceMock.refreshToken).toHaveBeenCalledWith({
      accessToken: 'test',
      refreshToken: 'test',
    });
    expect(data).toBeTruthy();
  });
});
