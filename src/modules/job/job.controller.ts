import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { RolesEnum } from 'src/constants/role.enum';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from '../user/entities/user.entity';
import { CreateJobDto } from './dtos/create-job.dto';
import { GetJobDto } from './dtos/get-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { Job } from './entities/job.entity';
import { JobService } from './job.service';

@ApiTags('job')
@ApiBearerAuth()
@Controller({ version: '1' })
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  @Roles(RolesEnum.EMPLOYER, RolesEnum.CANDIDATE)
  @ResponseMessage('Job list retrieved successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Job retrieved' })
  @PaginatedSwaggerDocs(GetJobDto, {
    sortableColumns: ['id'],
    defaultSortBy: [['id', 'DESC']],
    defaultLimit: 10,
    maxLimit: 100,
    relativePath: false,
    ignoreSearchByInQueryParam: true,
    ignoreSelectInQueryParam: false,
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search for keywords, location etc' })
  getJobs(@Paginate() pagination: PaginateQuery) {
    return this.jobService.getJobs(pagination);
  }

  @Get(':id')
  @Roles(RolesEnum.EMPLOYER, RolesEnum.CANDIDATE)
  @ResponseMessage('Job retrieved successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Job found', type: Job })
  @ApiNotFoundResponse({ description: 'Job not found' })
  getJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getJob(id);
  }

  @Post()
  @Roles(RolesEnum.EMPLOYER)
  @ResponseMessage('Job created successfully')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'Job created' })
  createJob(@Body() dto: CreateJobDto, @AuthUser() authUser: User) {
    return this.jobService.createJob(authUser, dto);
  }

  @Patch(':id')
  @Roles(RolesEnum.EMPLOYER)
  @ResponseMessage('Job updated successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Job updated' })
  @ApiNotFoundResponse({ description: 'Job not found' })
  updateJob(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateJobDto, @AuthUser() authUser: User) {
    return this.jobService.updateJob(id, dto, authUser);
  }

  @Delete(':id')
  @Roles(RolesEnum.EMPLOYER)
  @ResponseMessage('Job deleted successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Job deleted' })
  @ApiNotFoundResponse({ description: 'Job not found' })
  deleteJob(@Param('id', ParseIntPipe) id: number, @AuthUser() authUser: User) {
    return this.jobService.remove(id, authUser);
  }
}
