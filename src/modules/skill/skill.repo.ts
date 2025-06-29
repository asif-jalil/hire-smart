import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from 'src/common/base.repo';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillRepository extends BaseRepository<Skill> {
  constructor(@InjectRepository(Skill) repo: Repository<Skill>) {
    super(repo);
  }
}
