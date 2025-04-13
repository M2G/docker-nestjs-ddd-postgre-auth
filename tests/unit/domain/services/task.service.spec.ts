import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { TaskService } from '@domain/services';
import userData from 'tests/mocks/userData.mock';
import { mockRedis } from 'tests/mocks/redis-mock';
import { REDIS_CLIENT } from 'src/config/redis-client.type';
import { mockService } from 'tests/mocks';

const oneDayInSeconds = 60;

describe('TaskService', () => {
  let testingModule: TestingModule;
  let taskService: TaskService;

  const taskServiceMock: MockProxy<any> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        /*
        SequelizeModule.forRoot({
          autoLoadModels: true,
          database: 'test_db',
          dialect: 'postgres',
          host: 'postgres',
          password: 'postgres',
          port: 5432,
          synchronize: true,
          username: 'postgres',
        }),
        UserModule,
        */
      ],
      providers: [mockService(TaskService, taskServiceMock)],
    })
      .overrideProvider(REDIS_CLIENT)
      .useValue(mockRedis)
      .compile();

    taskService = testingModule.get<any>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  it('should successfully find user', async () => {
    taskServiceMock.lastConnectedUser.mockResolvedValue();
    await taskService.lastConnectedUser();
    expect(taskServiceMock.lastConnectedUser).toHaveBeenCalledTimes(1);
    expect(taskServiceMock.lastConnectedUser).toHaveBeenCalledWith();
  });
});
