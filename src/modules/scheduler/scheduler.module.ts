import { Module } from '@nestjs/common';
import { JobModule } from '../job/job.module';
import { UserModule } from '../user/user.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [UserModule, JobModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
