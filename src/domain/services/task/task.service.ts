import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '@domain/services';
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

  async lastConnectedUser(): Promise<void | null> {
    try {
      for await (const key of (await this.redisService.findLastUserConnected()) || []) {
        console.log('key', key);

        const usersInfo = await this.redisService.findLastUserConnectected(key);

        if (!usersInfo) return null;

        const { id, last_connected_at: lastConnectedAt }: User = JSON.parse(usersInfo);

        console.log('usersInfo', usersInfo);

        const [, [updatedUser]] = await this.userModel.update(
          {
            id,
            last_connected_at: lastConnectedAt,
          },
          {
            where: { id },
          },
        );

        /*
           const updatedUser: any = await usersRepository.update({
             id: usersInfo?.id,
             last_connected_at: usersInfo?.last_connected_at,
           });
           */

        this.logger.debug(
          '[Users.updateLastConnectedAt] users updated in database',
          updatedUser.id,
        );
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
