import { Injectable, Logger } from '@nestjs/common';
import { JobStatus } from 'src/constants/status.enum';
import NotFoundException from 'src/exceptions/not-found.exception';
import { ApplicationRepository } from 'src/modules/job/application.repo';
import { JobRepository } from 'src/modules/job/job.repo';
import { CandidatePreferenceRepository } from 'src/modules/user/candidate-preference.repo';
import { Between, ILike, In, IsNull, LessThanOrEqual, Not, Or } from 'typeorm';
import { JobRecommendationProps } from '../types/background-jobs.types';

@Injectable()
export class JobRecommendWorker {
  private readonly logger = new Logger(JobRecommendWorker.name);

  constructor(
    private readonly jobRepo: JobRepository,
    private readonly applicationRepo: ApplicationRepository,
    private readonly candidatePreferenceRepo: CandidatePreferenceRepository,
  ) {}

  async process(data: JobRecommendationProps) {
    const { candidateId } = data;

    const preference = await this.candidatePreferenceRepo.findOne({
      select: {
        id: true,
        expectedSalary: true,
        preferredLocation: true,
        preferredSkills: { id: true, skill: { id: true } },
      },
      where: { candidateId },
      relations: {
        preferredSkills: { skill: true },
      },
    });

    if (!preference) {
      throw new NotFoundException({ message: 'Candidate preference not found' });
    }

    const skillIds = preference.preferredSkills.map((ps) => ps.skill.id);
    const expectedSalary = preference.expectedSalary;
    const preferredLocation = preference.preferredLocation;

    const appliedJobIds = (
      await this.applicationRepo.findMany({
        where: { candidateId },
        select: { jobId: true },
      })
    ).map((a) => a.jobId);

    const jobs = await this.jobRepo.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        minSalary: true,
        maxSalary: true,
        createdAt: true,
        jobSkills: {
          id: true,
          skill: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        status: Not(JobStatus.ARCHIVED),
        location: ILike(preferredLocation),
        minSalary: LessThanOrEqual(expectedSalary),
        maxSalary: Or(IsNull(), Between(expectedSalary, expectedSalary + 40000)),
        id: appliedJobIds.length ? Not(In(appliedJobIds)) : undefined,
        jobSkills: {
          skillId: In(skillIds),
        },
      },
      relations: {
        jobSkills: {
          skill: true,
        },
      },
      take: 10,
      order: { createdAt: 'DESC' },
    });

    const formatted = jobs.map((job) => {
      const { jobSkills, ...rest } = job;
      return {
        ...rest,
        skills: jobSkills.map((js) => js.skill.name),
      };
    });

    this.logger.log('==========MOCKING JOB RECOMMENDATION==========');
    this.logger.log(formatted);
    this.logger.log('==========MOCKING JOB RECOMMENDATION END==========');

    return formatted;
  }
}
