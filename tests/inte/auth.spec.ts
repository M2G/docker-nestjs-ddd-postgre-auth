import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@domain/services';
import { AuthControllers } from '@application/controllers';

describe('AuthControllers', () => {
  let testingModule: TestingModule;
  let authControllers: AuthControllers;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn().mockImplementation(() => ({
      accessToken: 'test',
    })),
    register: jest.fn().mockImplementation(() => ({})),
  };

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AuthControllers],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    authService = testingModule.get<AuthService>(AuthService);
    authControllers = testingModule.get<AuthControllers>(AuthControllers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should return a single movie', async () => {
    const user = Promise.resolve({ accessToken: 'test' });

    const result = user;
    const spy = jest.spyOn(authService, 'login').mockImplementation(() => result);
    spy.mockImplementation(() => result);

    expect(await authControllers.login({ user })).toBe(await result);
  });

  it('should return a single movie 2', async () => {
    const user = Promise.resolve({ accessToken: 'test' });

    const result = user;
    const spy = jest.spyOn(authService, 'register');
    spy.mockImplementation(() => result);

    expect(await authControllers.create(user)).toBe(await result);
  });
});
