import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/abstract.entity';
import { RolesEnum } from 'src/constants/role.enum';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';

@Entity({ name: 'users' })
@Index('IDX_VERIFIEDAT_CREATEDAT_ROLE', ['verifiedAt', 'createdAt', 'role'])
export class User extends AbstractEntity {
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Exclude({ toPlainOnly: false })
  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  role: RolesEnum;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Exclude()
  private tempPassword?: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async beforeActionsPassword() {
    if (this.tempPassword !== this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    delete this.tempPassword;
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
