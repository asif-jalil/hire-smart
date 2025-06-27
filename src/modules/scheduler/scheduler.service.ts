import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment from 'moment';
import { RolesEnum } from 'src/constants/role.enum';
import { LessThan, Not } from 'typeorm';
import { UserRepository } from '../user/user.repo';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly userRepo: UserRepository) {}

  // Every Sunday at midnight
  @Cron('0 0 * * 0', {
    name: 'cleanup-unverified-users',
  })
  async handleCleanup(): Promise<void> {
    this.logger.log('Running cleanup: deleting unverified users');

    const cutoff = moment().subtract(7, 'days').toDate();

    const result = await this.userRepo.delete({
      isVerified: false,
      createdAt: LessThan(cutoff),
      role: Not(RolesEnum.ADMIN),
    });

    this.logger.log(`Deleted ${result.affected} unverified users.`);
  }
}
