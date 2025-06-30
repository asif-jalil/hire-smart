import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JobNotificationWorker {
  private readonly logger = new Logger(JobNotificationWorker.name);

  process(data: any) {
    this.logger.log('====== CANDIDATE NOTIFICATION START ======');
    this.logger.log(data);
    this.logger.log('====== CANDIDATE NOTIFICATION END ======');
  }
}
