import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolesEnum } from 'src/constants/role.enum';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateBulkSkillsDto } from './dto/create-bulk-skill.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillService } from './skill.service';

@ApiTags('skills')
@ApiBearerAuth()
@Roles(RolesEnum.EMPLOYER, RolesEnum.CANDIDATE)
@Controller({ version: '1' })
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @ResponseMessage('Skill created successfully')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'Skill created' })
  createSkill(@Body() dto: CreateSkillDto) {
    return this.skillService.createSkill(dto);
  }

  @Post('bulk')
  @ResponseMessage('Skills created successfully')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'Skills created' })
  createMany(@Body() dto: CreateBulkSkillsDto) {
    return this.skillService.createBulkSkills(dto);
  }

  @Get()
  @ResponseMessage('Skills retrieved successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of skills retrieved' })
  getSkills() {
    return this.skillService.getSkills();
  }

  @Delete(':id')
  @ResponseMessage('Skill deleted successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Skill deleted' })
  @ApiNotFoundResponse({ description: 'Skill not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.skillService.remove(id);
  }
}
