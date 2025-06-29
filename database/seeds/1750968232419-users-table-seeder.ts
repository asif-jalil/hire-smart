import { RolesEnum } from 'src/constants/role.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class UsersTableSeeder1750968232419 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const userRepo = dataSource.getRepository(User);

    const users = [
      {
        name: 'Admin',
        email: 'admin@mail.com',
        password: 'defaultPass123!',
        role: RolesEnum.ADMIN,
        verifiedAt: new Date(),
      },
      {
        name: 'Employee',
        email: 'employee@mail.com',
        password: 'defaultPass123!',
        role: RolesEnum.EMPLOYER,
        verifiedAt: new Date(),
      },
      {
        name: 'Candidate',
        email: 'candidate@mail.com',
        password: 'defaultPass123!',
        role: RolesEnum.CANDIDATE,
        verifiedAt: new Date(),
      },
    ];

    await userRepo.createQueryBuilder().insert().into(User).values(users).orIgnore().execute();
  }
}
