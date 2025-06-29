// src/modules/skills/entities/skill.entity.ts

import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'skills' })
export class Skill extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;
}
