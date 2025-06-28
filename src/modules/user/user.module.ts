import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatePreferenceRepository } from './candidate-preference.repo';
import { User } from './user.entity';
import { UserRepository } from './user.repo';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, CandidatePreferenceRepository],
  exports: [UserRepository, CandidatePreferenceRepository],
})
export class UserModule {}
