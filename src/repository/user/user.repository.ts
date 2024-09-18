import { Injectable, Inject } from '@nestjs/common';
@Injectable()
export default class UserRepository {
  constructor(@Inject('USER_MODEL_PROVIDER') private readonly model: any) {}
  async create(user: any): Promise<any> {}
}
