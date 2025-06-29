import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from 'src/common/base.repo';
import { Repository } from 'typeorm';
import { CandidatePreference } from './entities/candidate-preference.entity';

@Injectable()
export class CandidatePreferenceRepository extends BaseRepository<CandidatePreference> {
  constructor(@InjectRepository(CandidatePreference) repo: Repository<CandidatePreference>) {
    super(repo);
  }
}
