const mockedRedisService = {
  findUser: jest.fn(),
  saveUser: jest.fn(),
  findUsers: jest.fn(),
  saveUsers: jest.fn(),
  removeUser: jest.fn(),
};

export default mockedRedisService;
