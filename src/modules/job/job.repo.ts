import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from 'src/common/base.repo';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';

@Injectable()
export class JobRepository extends BaseRepository<Job> {
  constructor(@InjectRepository(Job) repo: Repository<Job>) {
    super(repo);
  }
}
