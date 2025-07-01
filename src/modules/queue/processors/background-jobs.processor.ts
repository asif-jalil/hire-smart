import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BackgroundJob, Queues } from 'src/constants/queue.enum';
import { JobMatchingProps } from '../types/background-jobs.types';
import { JobMatching } from '../worker/job-matching.worker';

@Processor(Queues.BACKGROUND_JOBS)
export class BackgroundJobsProcessor extends WorkerHost {
  constructor(private readonly jobMatching: JobMatching) {
    super();
  }

  async process(job: Job<any, any, BackgroundJob>): Promise<any> {
    switch (job.name) {
      case BackgroundJob.JOB_MATCH: {
        await this.jobMatching.handle(job.data as JobMatchingProps);
        return;
      }
    }
  }
}
