import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationConsumer, Queues } from 'src/constants/queue.enum';
import { JobNotificationWorker } from '../worker/job-notification.worker';

@Processor(Queues.NOTIFICATION)
export class NotificationProcessor extends WorkerHost {
  constructor(private readonly jobNotification: JobNotificationWorker) {
    super();
  }

  process(job: Job<any, any, NotificationConsumer>): any {
    switch (job.name) {
      case NotificationConsumer.JOB_MATCHING_ALERT: {
        this.jobNotification.process(job.data);
        return;
      }
      case NotificationConsumer.JOB_RECOMMENDATION_ALERT: {
        this.jobNotification.process(job.data);
        return;
      }
    }
  }
}
