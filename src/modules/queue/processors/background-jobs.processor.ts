import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BackgroundJobsConsumer, Queues } from 'src/constants/queue.enum';
import { JobRecommendationProps } from '../types/background-jobs.types';
import { JobRecommendWorker } from '../worker/job-recommend.worker';

@Processor(Queues.BACKGROUND_JOBS)
export class BackgroundJobsProcessor extends WorkerHost {
  constructor(private readonly jobRecommend: JobRecommendWorker) {
    super();
  }

  async process(job: Job<JobRecommendationProps, any, BackgroundJobsConsumer>): Promise<any> {
    switch (job.name) {
      case BackgroundJobsConsumer.JOB_RECOMMENDATION: {
        await this.jobRecommend.process(job.data);
        return;
      }
    }
  }
}
