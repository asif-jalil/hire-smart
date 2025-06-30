export enum Queues {
  BACKGROUND_JOBS = 'background-jobs',
  NOTIFICATION = 'notification',
}

export enum BackgroundJobsConsumer {
  JOB_MATCHING = 'JOB_MATCHING',
  JOB_RECOMMENDATION = 'JOB_RECOMMENDATION',
}

export enum NotificationConsumer {
  JOB_MATCHING_ALERT = 'JOB_MATCHING_ALERT',
  JOB_RECOMMENDATION_ALERT = 'JOB_RECOMMENDATION_ALERT',
}
