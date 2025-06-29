import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillModule } from '../skill/skill.module';
import { JobSkill } from './entities/job-skill.entity';
import { Job } from './entities/job.entity';
import { JobSkillRepository } from './job-skill.repo';
import { JobController } from './job.controller';
import { JobRepository } from './job.repo';
import { JobService } from './job.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobSkill]), SkillModule],
  controllers: [JobController],
  providers: [JobService, JobRepository, JobSkillRepository],
  exports: [JobRepository, JobSkillRepository],
})
export class JobModule {}
