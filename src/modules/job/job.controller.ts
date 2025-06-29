import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolesEnum } from 'src/constants/role.enum';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from '../user/entities/user.entity';
import { CreateJobDto } from './dtos/create-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { JobService } from './job.service';

@ApiTags('jobs')
@ApiBearerAuth()
@Roles(RolesEnum.EMPLOYER)
@Controller({ version: '1' })
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @ResponseMessage('Job created successfully')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'Job created' })
  create(@Body() dto: CreateJobDto, @AuthUser() authUser: User) {
    return this.jobService.createJob(authUser, dto);
  }

  @Patch(':id')
  @ResponseMessage('Job updated successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Job updated' })
  @ApiNotFoundResponse({ description: 'Job not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateJobDto, @AuthUser() authUser: User) {
    return this.jobService.updateJob(id, dto, authUser);
  }

  @Delete(':id')
  @ResponseMessage('Job deleted successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Job deleted' })
  @ApiNotFoundResponse({ description: 'Job not found' })
  remove(@Param('id', ParseIntPipe) id: number, @AuthUser() authUser: User) {
    return this.jobService.remove(id, authUser);
  }
}
