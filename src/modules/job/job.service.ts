import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { JobStatus } from 'src/constants/status.enum';
import BadRequestException from 'src/exceptions/bad-request.exception';
import NotFoundException from 'src/exceptions/not-found.exception';
import { buildCacheKey } from 'src/utils/cahce-keys';
import { DataSource, In, SelectQueryBuilder } from 'typeorm';
import { SkillRepository } from '../skill/skill.repo';
import { User } from '../user/entities/user.entity';
import { CreateJobDto } from './dtos/create-job.dto';
import { PostedBy } from './dtos/get-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { Job } from './entities/job.entity';
import { JobSkillRepository } from './job-skill.repo';
import { JobRepository } from './job.repo';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    private readonly jobRepo: JobRepository,
    private readonly skillRepo: SkillRepository,
    private readonly jobSkillRepo: JobSkillRepository,
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createJob(authUser: User, dto: CreateJobDto) {
    const { skillIds, ...jobPayload } = dto;

    const foundSkills = await this.skillRepo.findMany({
      where: { id: In(skillIds) },
    });

    if (foundSkills.length !== skillIds.length) {
      throw new BadRequestException({
        skillIds: 'Some skills are not found',
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const job = await this.jobRepo.create(
        {
          ...jobPayload,
          postedBy: authUser.id,
          status: JobStatus.OPEN,
        },
        manager,
      );

      const jobSkills = skillIds.map((skillId) => ({
        jobId: job.id,
        skillId,
      }));

      await this.jobSkillRepo.createMany(jobSkills, manager);

      await this.cacheManager.del(buildCacheKey().METRIC);

      await queryRunner.commitTransaction();

      return job;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error at job creating', error);

      throw new BadRequestException({
        message: 'Error at job creating',
      });
    } finally {
      await queryRunner.release();
    }
  }

  async updateJob(id: number, dto: UpdateJobDto, authUser: User) {
    const job = await this.jobRepo.findOne({ where: { id } });

    if (!job) {
      throw new NotFoundException({
        message: 'Job not found',
      });
    }

    if (job.postedBy !== authUser.id) {
      throw new BadRequestException({
        message: 'You are not authorized to update this job',
      });
    }

    if (job.status === JobStatus.ARCHIVED) {
      throw new BadRequestException({
        message: 'You cannot update an archived job',
      });
    }

    const { skillIds, ...updatePayload } = dto;

    if (skillIds) {
      const foundSkills = await this.skillRepo.findMany({
        where: { id: In(skillIds) },
      });

      if (foundSkills.length !== skillIds.length) {
        throw new BadRequestException({
          message: 'Some provided skills are invalid',
        });
      }

      await this.jobSkillRepo.delete({ jobId: job.id });

      const newJobSkills = skillIds.map((skillId) => ({
        jobId: job.id,
        skillId,
      }));
      await this.jobSkillRepo.createMany(newJobSkills);
    }

    await this.jobRepo.update(job.id, updatePayload);
    await job.reload();

    await this.cacheManager.del(buildCacheKey(job.id).JOB_WITH_ID);

    return job;
  }

  async remove(id: number, authUser: User) {
    const job = await this.jobRepo.findOne({ where: { id, postedBy: authUser.id } });

    if (!job) {
      throw new NotFoundException({
        message: 'Job not found',
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.jobSkillRepo.delete({ jobId: job.id }, manager);
      await this.jobRepo.delete(job.id, manager);

      await queryRunner.commitTransaction();

      return {
        id: job.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error at job removal', error);

      throw new BadRequestException({
        message: 'Error at job removal',
      });
    } finally {
      await queryRunner.release();
    }
  }

  getJobs(pagination: PaginateQuery, authUser: User, postedBy: PostedBy): Promise<Paginated<Job>> {
    const queryBuilder: SelectQueryBuilder<Job> = this.jobRepo
      .createQueryBuilder('job')
      .leftJoin('job.poster', 'poster')
      .leftJoin('job.jobSkills', 'jobSkills')
      .leftJoin('jobSkills.skill', 'skill')
      .select([
        'job.id',
        'job.title',
        'job.description',
        'job.location',
        'job.status',
        'job.minSalary',
        'job.maxSalary',
        'job.createdAt',
        'poster.id',
        'poster.name',
        'poster.email',
        'poster.role',
        'poster.verifiedAt',
        'jobSkills.id',
        'skill.id',
        'skill.name',
      ]);

    if (pagination.search) {
      queryBuilder.andWhere('job.fts @@ plainto_tsquery(:search)', { search: pagination.search });
    }

    if (postedBy === PostedBy.ME) {
      queryBuilder.andWhere('job.postedBy = :userId', { userId: authUser.id });
    } else if (postedBy === PostedBy.OTHERS) {
      queryBuilder.andWhere('job.postedBy != :userId', { userId: authUser.id });
    }

    return paginate(pagination, queryBuilder, {
      sortableColumns: ['id'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 10,
      maxLimit: 100,
      relativePath: false,
      ignoreSearchByInQueryParam: true,
      ignoreSelectInQueryParam: false,
    });
  }

  getJob(id: number) {
    return this.jobRepo.findOneOrThrow(
      {
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          status: true,
          minSalary: true,
          maxSalary: true,
          createdAt: true,
          poster: {
            id: true,
            name: true,
            email: true,
            role: true,
            verifiedAt: true,
          },
          jobSkills: {
            id: true,
            skill: {
              id: true,
              name: true,
            },
          },
        },
        where: { id },
        relations: {
          poster: true,
          jobSkills: {
            skill: true,
          },
        },
      },
      'Job not found',
    );
  }
}
