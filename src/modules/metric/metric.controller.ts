import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolesEnum } from 'src/constants/role.enum';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { MetricService } from './metric.service';

@ApiTags('metric')
@ApiBearerAuth()
@Controller({ version: '1' })
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  @ResponseMessage('Admin metrics retrieved successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Admin dashboard metrics' })
  getAdminMetrics() {
    return this.metricService.getAdminMetrics();
  }
}
