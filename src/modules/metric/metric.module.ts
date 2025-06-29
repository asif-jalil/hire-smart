import { Module } from '@nestjs/common';
import { JobModule } from '../job/job.module';
import { UserModule } from '../user/user.module';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';

@Module({
  imports: [UserModule, JobModule],
  controllers: [MetricController],
  providers: [MetricService],
})
export class MetricModule {}
