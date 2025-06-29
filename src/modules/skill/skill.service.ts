import { Injectable } from '@nestjs/common';
import BadRequestException from 'src/exceptions/bad-request.exception';
import { In } from 'typeorm';
import { CreateBulkSkillsDto } from './dto/create-bulk-skill.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillRepository } from './skill.repo';

@Injectable()
export class SkillService {
  constructor(private readonly skillRepo: SkillRepository) {}

  createSkill(dto: CreateSkillDto) {
    const { name } = dto;
    return this.skillRepo.create({ name });
  }

  async createBulkSkills(dto: CreateBulkSkillsDto) {
    const names = dto.skills.map((skill) => skill.name);

    const skills = await this.skillRepo.findMany({
      where: { name: In(names) },
      select: { name: true },
    });

    const existing = skills.map((s) => s.name);

    const uniqueSkills = names.filter((name) => !existing.includes(name)).map((name) => ({ name }));

    if (!uniqueSkills.length) {
      throw new BadRequestException({
        skills: 'All provided skills already exist',
      });
    }

    const savedSkills = await this.skillRepo.createMany(uniqueSkills);

    return savedSkills;
  }

  getSkills() {
    return this.skillRepo.findMany({
      select: { id: true, name: true },
      order: { name: 'ASC' },
    });
  }

  async remove(id: number) {
    await this.skillRepo.findOneOrThrow(
      {
        where: { id },
        select: { id: true },
      },
      'Skill not found',
    );

    await this.skillRepo.delete(id);

    return {
      id: id,
    };
  }
}
