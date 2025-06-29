import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from 'src/common/base.repo';
import { Repository } from 'typeorm';
import { JobSkill } from './entities/job-skill.entity';

@Injectable()
export class JobSkillRepository extends BaseRepository<JobSkill> {
  constructor(@InjectRepository(JobSkill) repo: Repository<JobSkill>) {
    super(repo);
  }
}
