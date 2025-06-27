import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [UserModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
