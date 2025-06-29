import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { SkillController } from './skill.controller';
import { SkillRepository } from './skill.repo';
import { SkillService } from './skill.service';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [SkillController],
  providers: [SkillService, SkillRepository],
  exports: [SkillRepository],
})
export class SkillModule {}
