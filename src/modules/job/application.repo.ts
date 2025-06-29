import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from 'src/common/base.repo';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationRepository extends BaseRepository<Application> {
  constructor(@InjectRepository(Application) repo: Repository<Application>) {
    super(repo);
  }
}
