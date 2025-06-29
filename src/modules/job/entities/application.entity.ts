import { AbstractEntity } from 'src/common/abstract.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('applications')
@Index('IDX_JOB_CANDIDATE', ['jobId', 'candidateId'], { unique: true })
export class Application extends AbstractEntity {
  @Column({ type: 'int', unsigned: true, nullable: false })
  jobId: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  candidateId: number;

  @Column({ type: 'text', nullable: true })
  coverLetter?: string;

  @Column({ type: 'varchar', nullable: false })
  resumeUrl: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  status: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  lastReviewedBy?: number;

  @Column({ type: 'timestamp', nullable: true })
  lastReviewedAt?: Date;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidateId' })
  candidate: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lastReviewedBy' })
  lastReviewer?: User;
}
