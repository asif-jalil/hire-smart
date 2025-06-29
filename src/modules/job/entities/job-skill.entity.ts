import { AbstractEntity } from 'src/common/abstract.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Job } from './job.entity';

@Entity({ name: 'jobSkills' })
@Unique('IDX_JOB_SKILL', ['jobId', 'skillId'])
export class JobSkill extends AbstractEntity {
  @Column({ type: 'int', nullable: false, unsigned: true })
  jobId: number;

  @Column({ type: 'int', nullable: false, unsigned: true })
  skillId: number;

  @ManyToOne(() => Job, (job) => job.jobSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => Skill, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}
