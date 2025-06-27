import { RolesEnum } from 'src/constants/role.enum';
import { User } from 'src/modules/user/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class UsersTableSeeder1750968232419 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const userRepo = dataSource.getRepository(User);

    const user = userRepo.create({
      name: 'Admin',
      email: 'admin@mail.com',
      password: 'defaultPass123!',
      role: RolesEnum.ADMIN,
      isVerified: true,
    });

    await userRepo.createQueryBuilder().insert().into(User).values(user).orIgnore().execute();
  }
}
