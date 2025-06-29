// src/modules/skills/entities/preferred-skill.entity.ts

import { AbstractEntity } from 'src/common/abstract.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import { CandidatePreference } from 'src/modules/user/entities/candidate-preference.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity({ name: 'preferredSkills' })
@Unique('IDX_CANDIDATE_PREFERENCE_SKILL', ['candidatePreferenceId', 'skillId'])
export class PreferredSkill extends AbstractEntity {
  @Column({ type: 'int' })
  candidatePreferenceId: number;

  @Column({ type: 'int' })
  skillId: number;

  @ManyToOne(() => CandidatePreference, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidatePreferenceId' })
  candidatePreference: CandidatePreference;

  @ManyToOne(() => Skill, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}
