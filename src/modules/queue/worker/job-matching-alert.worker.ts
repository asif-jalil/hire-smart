import { Injectable, Logger } from '@nestjs/common';
import { JobMatchingAlertProps } from '../types/notification.types';
import { JobWorker } from '../types/worker.types';

@Injectable()
export class JobMatchingAlert implements JobWorker<JobMatchingAlertProps> {
  private readonly logger = new Logger(JobMatchingAlert.name);

  handle(data: JobMatchingAlertProps) {
    this.logger.log('====== CANDIDATE NOTIFICATION START ======');
    this.logger.log(data);
    this.logger.log('====== CANDIDATE NOTIFICATION END ======');
  }
}
