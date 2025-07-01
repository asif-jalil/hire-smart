import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Notification, Queues } from 'src/constants/queue.enum';
import { JobMatchingAlertProps } from '../types/notification.types';
import { JobMatchingAlert } from '../worker/job-matching-alert.worker';

@Processor(Queues.NOTIFICATION)
export class NotificationProcessor extends WorkerHost {
  constructor(private readonly jobNotification: JobMatchingAlert) {
    super();
  }

  process(job: Job<any, any, Notification>): any {
    switch (job.name) {
      case Notification.JOB_MATCH: {
        const data = job.data as JobMatchingAlertProps;
        this.jobNotification.handle(data);
        return;
      }
    }
  }
}
