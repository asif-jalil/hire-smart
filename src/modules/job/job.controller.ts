import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { RolesEnum } from 'src/constants/role.enum';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from '../user/entities/user.entity';
import { ApplicationService } from './application.service';
import { ApplyJobDto } from './dtos/apply-job.dto';
import { CreateJobDto } from './dtos/create-job.dto';
import { GetJobDto, PostedBy } from './dtos/get-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { Application } from './entities/application.entity';
import { Job } from './entities/job.entity';
import { JobService } from './job.service';

export const JobPaginationConfig = {
  sortableColumns: ['id'],
  defaultLimit: 10,
  maxLimit: 100,
  relativePath: false,
  ignoreSearchByInQueryParam: true,
  ignoreSelectInQueryParam: false,
};

@ApiTags('job')
@ApiBearerAuth()
@Controller({ version: '1' })
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly applicationService: ApplicationService,
  ) {}

  @Get()
  @Roles(RolesEnum.EMPLOYER, RolesEnum.CANDIDATE)
  @ResponseMessage('Job list retrieved successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Job retrieved' })
  @PaginatedSwaggerDocs(GetJobDto, JobPaginationConfig)
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search for keywords, location etc' })
  @ApiQuery({
    name: 'postedBy',
    enum: PostedBy,
    required: false,
    description: 'Filter by who posted the job (me, others, all)',
    example: PostedBy.ME,
  })
  getJobs(
    @Paginate() pagination: PaginateQuery,
    @AuthUser() authUser: User,
    @Query('postedBy', new DefaultValuePipe('all')) postedBy: PostedBy,
  ) {
    return this.jobService.getJobs(pagination, authUser, postedBy);
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

  @Post(':id/apply')
  @Roles(RolesEnum.CANDIDATE)
  @ResponseMessage('Applied to job successfully')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'Job application submitted' })
  @ApiNotFoundResponse({ description: 'Job not found or user not authorized' })
  applyJob(@Param('id', ParseIntPipe) id: number, @Body() dto: ApplyJobDto, @AuthUser() authUser: User) {
    return this.applicationService.applyJob(id, authUser, dto);
  }

  @Get(':id/applications')
  @Roles(RolesEnum.EMPLOYER)
  @ResponseMessage('Applications retrieved successfully')
  @HttpCode(HttpStatus.OK)
  @PaginatedSwaggerDocs(Application, JobPaginationConfig)
  getJobApplications(
    @Param('id', ParseIntPipe) id: number,
    @Paginate() pagination: PaginateQuery,
    @AuthUser() authUser: User,
  ) {
    return this.applicationService.getJobApplications(id, authUser, pagination);
  }

  @Get(':id/applications/:applicationId')
  @Roles(RolesEnum.EMPLOYER, RolesEnum.CANDIDATE)
  @ResponseMessage('Application retrieved successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Application retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Job or Application not found' })
  getApplication(
    @Param('id', ParseIntPipe) id: number,
    @Param('applicationId', ParseIntPipe) applicationId: number,
    @AuthUser() authUser: User,
  ) {
    return this.applicationService.getApplication(id, applicationId, authUser);
  }
}
