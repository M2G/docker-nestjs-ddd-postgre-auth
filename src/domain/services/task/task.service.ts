import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
// import { RedisService } from '@domain/services';
import RedisService from '@domain/services/cache/redis.service';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@infrastructure/models';

@Injectable()
class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    // @TODO circular dependency
    // private readonly test: UserService,
    private readonly redisService: RedisService,
  ) {}

  async lastConnectedUser(): Promise<boolean | null | any> {
    try {
      for await (const key of (await this.redisService.findLastUserConnected()) as AsyncIterable<string>) {

        console.log('usersInfo', key);

        if (!key?.length) return null;

        const usersInfo = await this.redisService.findLastUserConnectected(key);

        console.log('usersInfo', usersInfo);

        if (!usersInfo) return null;

        const { id, last_connected_at: lastConnectedAt }: User = JSON.parse(usersInfo);

        const [ok] = await this.userModel.update(
          {
            id,
            last_connected_at: lastConnectedAt,
          },
          {
            where: { id },
          },
        );

        console.log('ok', ok);

        this.logger.debug('[Users.updateLastConnectedAt] users updated in database', id);

        return !!ok;
      }
    } catch (error) {
      this.logger.debug('[Users.updateLastConnectedAt]', error);
      throw new Error(error);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    void this.lastConnectedUser();
    this.logger.debug('Called every 30 seconds');
  }
}

export default TaskService;
