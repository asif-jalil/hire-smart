import { InjectQueue } from '@nestjs/bullmq';
import { Queues } from 'src/constants/queue.enum';

export const InjectBackgroundQueue = (): ParameterDecorator => InjectQueue(Queues.BACKGROUND_JOBS);
export const InjectNotificationQueue = (): ParameterDecorator => InjectQueue(Queues.NOTIFICATION);
