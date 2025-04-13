import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { mockRedis } from 'tests/mocks/redis-mock';
import { REDIS_CLIENT } from 'src/config/redis-client.type';
import { mockService } from 'tests/mocks';

const oneDayInSeconds = 60;

describe('YcI18nService', () => {
  let testingModule: TestingModule;
  let ycI18nService: YcI18nService;

  const YcI18nServiceMock: MockProxy<any> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [mockService(YcI18nService, YcI18nServiceMock)],
    })
      .overrideProvider(REDIS_CLIENT)
      .useValue(mockRedis)
      .compile();

    ycI18nService = testingModule.get(YcI18nService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(ycI18nService).toBeDefined();
  });

  it('should successfully find user', function () {
    YcI18nServiceMock.t.mockReturnValue('test');
    const result = ycI18nService.t('test');
    expect(result).toEqual('test');
    expect(YcI18nServiceMock.t).toHaveBeenCalledTimes(1);
    expect(YcI18nServiceMock.t).toHaveBeenCalledWith('test');
  });

  it('should successfully find user', function () {
    YcI18nServiceMock.lang.mockReturnValue('en');
    const result = ycI18nService.lang();
    expect(result).toEqual('en');
    expect(YcI18nServiceMock.lang).toHaveBeenCalledTimes(1);
    expect(YcI18nServiceMock.lang).toHaveBeenCalledWith();
  });
});
