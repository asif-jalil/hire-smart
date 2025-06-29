import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillModule } from '../skill/skill.module';
import { ApplicationRepository } from './application.repo';
import { ApplicationService } from './application.service';
import { Application } from './entities/application.entity';
import { JobSkill } from './entities/job-skill.entity';
import { Job } from './entities/job.entity';
import { JobSkillRepository } from './job-skill.repo';
import { JobController } from './job.controller';
import { JobRepository } from './job.repo';
import { JobService } from './job.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobSkill, Application]), SkillModule],
  controllers: [JobController],
  providers: [JobService, ApplicationService, JobRepository, JobSkillRepository, ApplicationRepository],
  exports: [JobRepository, JobSkillRepository, ApplicationRepository],
})
export class JobModule {}
