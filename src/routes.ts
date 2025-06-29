import { Routes } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JobModule } from './modules/job/job.module';
import { MetricModule } from './modules/metric/metric.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SkillModule } from './modules/skill/skill.module';

const routes: Routes = [
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'profile',
    module: ProfileModule,
  },
  {
    path: 'skills',
    module: SkillModule,
  },
  {
    path: 'jobs',
    module: JobModule,
  },
  {
    path: 'metrics',
    module: MetricModule,
  },
];

export default routes;
