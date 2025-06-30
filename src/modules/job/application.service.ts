import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { ApplicationStatus, JobStatus } from 'src/constants/status.enum';
import BadRequestException from 'src/exceptions/bad-request.exception';
import ForbiddenException from 'src/exceptions/forbidden.exception';
import NotFoundException from 'src/exceptions/not-found.exception';
import { buildCacheKey } from 'src/utils/cahce-keys';
import { User } from '../user/entities/user.entity';
import { ApplicationRepository } from './application.repo';
import { ApplyJobDto } from './dtos/apply-job.dto';
import { JobRepository } from './job.repo';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly jobRepo: JobRepository,
    private readonly applicationRepo: ApplicationRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async applyJob(id: number, authUser: User, dto: ApplyJobDto) {
    const job = await this.jobRepo.findOne({
      where: { id },
      select: { id: true, status: true },
    });

    if (!job) {
      throw new NotFoundException({
        message: 'Job not found',
      });
    }

    if (job.status === JobStatus.ARCHIVED) {
      throw new BadRequestException({
        message: 'You cannot apply to a archived job',
      });
    }

    const existingApp = await this.applicationRepo.findOne({
      where: { jobId: id, candidateId: authUser.id },
      select: { id: true },
    });

    if (existingApp) {
      throw new BadRequestException({
        message: 'You have already applied to this job',
      });
    }

    const application = await this.applicationRepo.create({
      ...dto,
      jobId: id,
      candidateId: authUser.id,
      status: ApplicationStatus.PENDING,
    });

    await this.cacheManager.del(buildCacheKey().METRIC);
    await this.cacheManager.del(buildCacheKey(job.id, application.id).JOB_APPLICATIONS);

    return application;
  }

  async getJobApplications(id: number, authUser: User, pagination: PaginateQuery) {
    const job = await this.jobRepo.findOne({
      where: { id },
      select: { id: true, postedBy: true },
    });

    if (!job) {
      throw new NotFoundException({ message: 'Job not found' });
    }

    if (job.postedBy !== authUser.id) {
      throw new ForbiddenException({
        message: 'You are not authorized to view applications for this job',
      });
    }

    const qb = this.applicationRepo
      .createQueryBuilder('application')
      .leftJoin('application.candidate', 'candidate')
      .leftJoin('candidate.candidatePreference', 'candidatePreference')
      .leftJoin('candidatePreference.preferredSkills', 'preferredSkills')
      .leftJoin('preferredSkills.skill', 'skill')
      .leftJoin('application.lastReviewer', 'lastReviewer')
      .select([
        'application.id',
        'application.coverLetter',
        'application.resumeUrl',
        'application.status',
        'application.lastReviewedAt',
        'application.createdAt',
        'candidate.id',
        'candidate.name',
        'candidate.email',
        'candidate.role',
        'candidate.verifiedAt',
        'candidate.lastLoginAt',
        'candidatePreference.id',
        'candidatePreference.preferredLocation',
        'candidatePreference.expectedSalary',
        'preferredSkills.id',
        'skill.id',
        'skill.name',
        'lastReviewer.id',
        'lastReviewer.name',
        'lastReviewer.email',
        'lastReviewer.role',
        'lastReviewer.verifiedAt',
        'lastReviewer.verifiedAt',
      ])
      .where('application.jobId = :jobId', { jobId: id })
      .orderBy('application.createdAt', 'DESC');

    return await paginate(pagination, qb, {
      sortableColumns: ['id'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 10,
      maxLimit: 100,
      relativePath: false,
      ignoreSearchByInQueryParam: true,
      ignoreSelectInQueryParam: false,
    });
  }

  async getApplication(jobId: number, applicationId: number, authUser: User) {
    const job = await this.jobRepo.findOne({
      where: { id: jobId },
      select: { id: true, postedBy: true },
    });

    if (!job) {
      throw new NotFoundException({ message: 'Job not found' });
    }

    const application = await this.applicationRepo.findOne({
      select: { id: true, jobId: true, candidateId: true },
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException({ message: 'Application not found' });
    }

    const isCandidate = application.candidateId === authUser.id;
    const isJobPoster = job.postedBy === authUser.id;

    if (!isCandidate && !isJobPoster) {
      throw new ForbiddenException({
        message: 'You are not authorized to view this application',
      });
    }

    if (isJobPoster) {
      await this.applicationRepo.update(application.id, {
        lastReviewedBy: authUser.id,
        lastReviewedAt: new Date(),
        status: ApplicationStatus.REVIEWING,
      });
    }

    const updatedApplication = await this.applicationRepo.findOne({
      select: {
        id: true,
        jobId: true,
        coverLetter: true,
        resumeUrl: true,
        status: true,
        lastReviewedAt: true,
        candidate: {
          id: true,
          name: true,
          email: true,
          role: true,
          verifiedAt: true,
          lastLoginAt: true,
          candidatePreference: {
            id: true,
            preferredLocation: true,
            expectedSalary: true,
            preferredSkills: {
              id: true,
              skill: {
                name: true,
              },
            },
          },
        },
        lastReviewer: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      where: { id: applicationId },
      relations: {
        candidate: {
          candidatePreference: {
            preferredSkills: {
              skill: true,
            },
          },
        },
        lastReviewer: true,
      },
    });

    return updatedApplication;
  }
}
