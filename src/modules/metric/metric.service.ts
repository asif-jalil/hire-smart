import { Injectable } from '@nestjs/common';
import { JobStatus } from 'src/constants/status.enum';
import { Not } from 'typeorm';
import { ApplicationRepository } from '../job/application.repo';
import { JobRepository } from '../job/job.repo';
import { UserRepository } from '../user/user.repo';

@Injectable()
export class MetricService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jobRepo: JobRepository,
    private readonly applicationRepo: ApplicationRepository,
  ) {}

  async getAdminMetrics() {
    const [[user], [job], [application], [activeJob], [pendingApp]] = await Promise.all([
      this.userRepo.findMany({ select: { id: true }, order: { id: 'DESC' }, take: 1 }),
      this.jobRepo.findMany({ select: { id: true }, order: { id: 'DESC' }, take: 1 }),
      this.applicationRepo.findMany({ select: { id: true }, order: { id: 'DESC' }, take: 1 }),
      this.jobRepo.findMany({
        where: { status: Not(JobStatus.ARCHIVED) },
        select: { id: true },
        order: { id: 'DESC' },
        take: 1,
      }),
      this.applicationRepo.findMany({
        where: { status: 'pending' },
        select: { id: true },
        order: { id: 'DESC' },
        take: 1,
      }),
    ]);

    return {
      totalUsers: user?.id ?? 0,
      totalJobs: job?.id ?? 0,
      totalApplications: application?.id ?? 0,
      activeJobs: activeJob?.id ?? 0,
      pendingApplications: pendingApp?.id ?? 0,
    };
  }
}
