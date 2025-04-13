import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import AuthModule from '../../src/auth.module';
import { AuthService } from '../../src/domain/services';
import User from '@infrastructure/models/user/user.model';
import { getModelToken } from '@nestjs/sequelize';

const user = {
  dataValues: {
    id: 5,
    username: 'test',
    password: 'password',
    name: 'test',
  },
  validatePassword: jest.fn().mockImplementation((password) => true),
};

const mockAuthService = {
  login: jest.fn().mockImplementation(() => ({
    accessToken: 'test',
  })),
  register: jest.fn().mockImplementation(() => ({
    ...user.dataValues,
  })),
};

const mockUsersModel = {};

describe('AppController (e2e)', () => {
  let testingModule: TestingModule;
  let app: INestApplication;
  let authToken;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getModelToken(User))
      .useValue(mockUsersModel)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    app = testingModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const loginResponse = await request(app.getHttpServer()).post('/auth/authenticate').send({
      email: 'smith.jackson@university.com',
      password: 'test',
    });

    authToken = `Bearer ${loginResponse.body.accessToken}`;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('/auth/authenticate (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/authenticate')
      .set('Authorization', authToken)
      .send({
        email: 'smith.jackson@university.com',
        password: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect({ accessToken: 'test' });
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .set('Authorization', authToken)
      .send({
        email: 'smith.jackson@university.com',
        password: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect(user.dataValues);
  });
});
