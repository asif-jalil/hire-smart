import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'candidatePreference' })
export class CandidatePreference extends AbstractEntity {
  @Column({ type: 'int', nullable: false })
  candidateId: number;

  @Column({ type: 'varchar', nullable: false })
  preferredLocation: string;

  @Column({ type: 'int', nullable: false })
  expectedSalary: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidateId' })
  candidate: User;
}
