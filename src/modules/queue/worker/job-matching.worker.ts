import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Notification } from 'src/constants/queue.enum';
import { InjectNotificationQueue } from 'src/decorators/inject-queue.decorator';
import { JobRepository } from 'src/modules/job/job.repo';
import { CandidatePreferenceRepository } from 'src/modules/user/candidate-preference.repo';
import { Between, ILike } from 'typeorm';
import { JobMatchingProps } from '../types/background-jobs.types';
import { JobWorker } from '../types/worker.types';

@Injectable()
export class JobMatching implements JobWorker<JobMatchingProps> {
  constructor(
    private readonly jobRepo: JobRepository,
    private readonly candidatePreferenceRepo: CandidatePreferenceRepository,
    @InjectNotificationQueue() private readonly notificationQueue: Queue,
  ) {}

  async handle(data: JobMatchingProps) {
    const { jobId } = data;

    const job = await this.jobRepo.findOneOrThrow(
      {
        where: { id: jobId },
        select: {
          id: true,
          location: true,
          minSalary: true,
          maxSalary: true,
          jobSkills: { id: true, skill: { id: true, name: true } },
        },
        relations: {
          jobSkills: { skill: true },
        },
      },
      'No job found',
    );

    const jobSkillIds = job.jobSkills.map((js) => js.skill.id);
    const jobLocation = job.location;
    const salaryFloor = job.minSalary;
    const salaryCeiling = job.maxSalary ?? job.minSalary;

    const preferences = await this.candidatePreferenceRepo.findMany({
      where: {
        preferredLocation: ILike(jobLocation),
        expectedSalary: Between(salaryFloor - 15000, salaryCeiling + 20000),
      },
      relations: {
        candidate: true,
        preferredSkills: { skill: true },
      },
      select: {
        id: true,
        candidate: {
          id: true,
          name: true,
          email: true,
        },
        preferredSkills: {
          id: true,
          skill: {
            id: true,
          },
        },
      },
      order: { id: 'DESC' },
    });

    const matchedPreferences = preferences
      .filter((pref) => {
        const candidateSkillIds = pref.preferredSkills.map((ps) => ps.skill.id);
        const commonSkills = candidateSkillIds.filter((id) => jobSkillIds.includes(id));
        const matchRatio = commonSkills.length / jobSkillIds.length;
        return matchRatio >= 0.5;
      })
      .map((pref) => pref.candidate);

    for (const preference of matchedPreferences) {
      await this.notificationQueue.add(Notification.JOB_MATCH, preference);
    }
  }
}
