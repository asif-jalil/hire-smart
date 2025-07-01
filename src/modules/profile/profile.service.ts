import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repo';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class ProfileService {
  constructor(private userRepo: UserRepository) {}

  async updatePassword(id: number, dto: UpdatePasswordDto) {
    const found = await this.userRepo.findOneOrThrow(
      {
        where: { id },
      },
      'User not found',
    );

    Object.assign(found, { password: dto.newPassword });
    const user = await this.userRepo.save(found);

    return {
      user,
    };
  }

  async getProfile(id: number) {
    const user = await this.userRepo.findOneOrThrow(
      {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          verifiedAt: true,
          lastLoginAt: true,
          candidatePreference: {
            id: true,
            expectedSalary: true,
            preferredLocation: true,
            preferredSkills: {
              id: true,
              skill: {
                id: true,
                name: true,
              },
            },
          },
        },
        where: { id },
        relations: {
          candidatePreference: {
            preferredSkills: {
              skill: true,
            },
          },
        },
      },
      'User not found',
    );

    const { preferredSkills, ...restPreference } = user.candidatePreference || {};

    return {
      ...user,
      candidatePreference: {
        ...restPreference,
        skills:
          preferredSkills?.map((ps) => ({
            id: ps.skill.id,
            name: ps.skill.name,
          })) || [],
      },
    };
  }
}
