import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Queues } from 'src/constants/queue.enum';
import { EnvService } from 'src/shared/services/env.service';
import { JobModule } from '../job/job.module';
import { UserModule } from '../user/user.module';
import { BackgroundJobsProcessor } from './processors/background-jobs.processor';
import { JobRecommendWorker } from './worker/job-recommend.worker';

@Module({
  imports: [JobModule, UserModule],
  providers: [BackgroundJobsProcessor, JobRecommendWorker],
})
export class QueueModule {
  static register(): DynamicModule {
    const queues = BullModule.registerQueue(
      ...Object.values(Queues).map((queue) => ({
        name: queue,
      })),
    );

    if (!queues.providers || !queues.exports) {
      throw new Error('Unable to build queue');
    }

    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (env: EnvService) => ({
            connection: {
              url: env.redisConfig.url,
            },
            defaultJobOptions: { attempts: 2, backoff: 2 },
          }),
          inject: [EnvService],
        }),
        queues,
      ],
      global: true,
      providers: [...queues.providers],
      exports: [...queues.exports],
    };
  }
}
