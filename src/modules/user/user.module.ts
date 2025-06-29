import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatePreferenceRepository } from './candidate-preference.repo';
import { CandidatePreference } from './entities/candidate-preference.entity';
import { PreferredSkill } from './entities/preferred-skills.entity';
import { User } from './entities/user.entity';
import { PreferredSkillRepository } from './preferred-skill.repo';
import { UserRepository } from './user.repo';

@Module({
  imports: [TypeOrmModule.forFeature([User, CandidatePreference, PreferredSkill])],
  providers: [UserRepository, CandidatePreferenceRepository, PreferredSkillRepository],
  exports: [UserRepository, CandidatePreferenceRepository, PreferredSkillRepository],
})
export class UserModule {}
