import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment from 'moment';
import { RolesEnum } from 'src/constants/role.enum';
import { JobStatus } from 'src/constants/status.enum';
import { IsNull, LessThan, Not } from 'typeorm';
import { JobRepository } from '../job/job.repo';
import { UserRepository } from '../user/user.repo';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly jobRepo: JobRepository,
  ) {}

  // Every Sunday at midnight
  @Cron('0 0 * * 0', {
    name: 'cleanup-unverified-users',
  })
  async handleCleanup(): Promise<void> {
    this.logger.warn('Running cleanup: deleting unverified users');

    const cutoff = moment().subtract(7, 'days').toDate();

    const result = await this.userRepo.delete({
      verifiedAt: IsNull(),
      createdAt: LessThan(cutoff),
      role: Not(RolesEnum.ADMIN),
    });

    this.logger.log(`Deleted ${result.affected} unverified users.`);
  }

  // Everyday at midnight
  @Cron('0 0 * * *', {
    name: 'archive-old-jobs',
  })
  async handleJobArchival(): Promise<void> {
    this.logger.warn('Running job archival: archiving jobs older than 30 days');

    const cutoff = moment().subtract(30, 'days').toDate();

    const result = await this.jobRepo.update(
      {
        createdAt: LessThan(cutoff),
        status: Not(JobStatus.ARCHIVED),
      },
      {
        status: JobStatus.ARCHIVED,
      },
    );

    this.logger.log(`Archived ${result.affected} old job posts.`);
  }
}
