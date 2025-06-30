import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Cache } from 'cache-manager';
import { BackgroundJobsConsumer } from 'src/constants/queue.enum';
import { RolesEnum } from 'src/constants/role.enum';
import { InjectBackgroundQueue } from 'src/decorators/inject-queue.decorator';
import BadRequestException from 'src/exceptions/bad-request.exception';
import NotFoundException from 'src/exceptions/not-found.exception';
import UnauthenticatedException from 'src/exceptions/unauthenticated.exception';
import { TokenService } from 'src/shared/services/token.service';
import { buildCacheKey } from 'src/utils/cahce-keys';
import { DataSource, In } from 'typeorm';
import { SkillRepository } from '../skill/skill.repo';
import { CandidatePreferenceRepository } from '../user/candidate-preference.repo';
import { User } from '../user/entities/user.entity';
import { PreferredSkillRepository } from '../user/preferred-skill.repo';
import { UserRepository } from '../user/user.repo';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/registration.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly token: TokenService,
    private readonly userRepo: UserRepository,
    private readonly candidatePreferenceRepo: CandidatePreferenceRepository,
    private readonly preferredSkillRepo: PreferredSkillRepository,
    private readonly skillRepo: SkillRepository,
    private dataSource: DataSource,
    @InjectBackgroundQueue() private readonly bgQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name, role, candidatePreference } = dto;

    if (role === RolesEnum.CANDIDATE) {
      const foundSkills = await this.skillRepo.findMany({ where: { id: In(candidatePreference.skillIds) } });

      if (foundSkills.length !== candidatePreference.skillIds.length) {
        throw new BadRequestException({
          skillIds: 'Some skills are not found',
        });
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newUser: User;

    try {
      newUser = await this.userRepo.create(
        {
          name,
          email,
          password,
          role,
          verifiedAt: new Date(),
          lastLoginAt: new Date(),
        },
        manager,
      );

      if (role === RolesEnum.CANDIDATE) {
        const { skillIds, ...preferencePayload } = candidatePreference;

        const preference = await this.candidatePreferenceRepo.create(
          {
            candidateId: newUser.id,
            ...preferencePayload,
          },
          manager,
        );
        const preferredSkills = skillIds.map((skillId) => ({
          candidatePreferenceId: preference.id,
          skillId,
        }));

        await this.preferredSkillRepo.createMany(preferredSkills, manager);
      }

      await this.cacheManager.del(buildCacheKey().METRIC);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error at registration', error);

      throw new BadRequestException({
        message: 'Error at registration',
      });
    } finally {
      await queryRunner.release();
    }

    const token = await this.token.signToken({
      id: newUser.id,
    });

    const authUser = await this.getAuthUser(newUser.id);

    return {
      user: authUser,
      token,
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userRepo.findOne({
      select: {
        id: true,
        password: true,
      },
      where: { email },
    });

    if (!user || !user.password) {
      throw new NotFoundException({
        email: 'Email and password does not match',
        password: 'Email and password does not match',
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new BadRequestException({
        email: 'Email and password does not match',
        password: 'Email and password does not match',
      });
    }

    await this.userRepo.update(user.id, {
      lastLoginAt: new Date(),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...restUser } = user;

    const token = await this.token.signToken(restUser);
    const authUser = await this.getAuthUser(user.id);

    if (authUser.role === RolesEnum.CANDIDATE) {
      await this.bgQueue.add(BackgroundJobsConsumer.JOB_RECOMMENDATION, { candidateId: authUser.id });
    }

    return {
      user: authUser,
      token,
    };
  }

  async authAccount(token: string) {
    if (!token) {
      throw new BadRequestException({
        message: 'Invalid request',
      });
    }

    const payload = this.token.decodeToken(token);

    if (!payload.isValid) {
      throw new UnauthenticatedException({
        message: 'You are not authenticated',
      });
    }

    const user = await this.userRepo.findOne({
      select: { id: true },
      where: { id: payload.decoded?.id },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'Invalid user',
      });
    }

    const authUser = await this.getAuthUser(user.id);

    return {
      user: authUser,
    };
  }

  async getAuthUser(userId: number) {
    const [user] = await this.userRepo.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verifiedAt: true,
        lastLoginAt: true,
      },
      where: { id: userId },
    });

    return user;
  }
}
