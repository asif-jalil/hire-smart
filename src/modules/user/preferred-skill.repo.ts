import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from 'src/common/base.repo';
import { Repository } from 'typeorm';
import { PreferredSkill } from './entities/preferred-skills.entity';

@Injectable()
export class PreferredSkillRepository extends BaseRepository<PreferredSkill> {
  constructor(@InjectRepository(PreferredSkill) repo: Repository<PreferredSkill>) {
    super(repo);
  }
}
