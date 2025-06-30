import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BackgroundJobsConsumer, Queues } from 'src/constants/queue.enum';
import { JobMatching } from '../worker/job-matching.worker';

@Processor(Queues.BACKGROUND_JOBS)
export class BackgroundJobsProcessor extends WorkerHost {
  constructor(private readonly jobMatching: JobMatching) {
    super();
  }

  async process(job: Job<any, any, BackgroundJobsConsumer>): Promise<any> {
    switch (job.name) {
      case BackgroundJobsConsumer.JOB_MATCHING: {
        await this.jobMatching.process(job.data);
        return;
      }
    }
  }
}
