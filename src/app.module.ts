import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE, RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppExceptionFilter } from './filters/app-exception.filter';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { JobModule } from './modules/job/job.module';
import { MetricModule } from './modules/metric/metric.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { SkillModule } from './modules/skill/skill.module';
import { UserModule } from './modules/user/user.module';
import { StripRequestBodyPipe } from './pipes/strip-req-body.pipe';
import { ValidateIncomingInput } from './pipes/validate-incoming-input.pipe';
import routes from './routes';
import { EnvService } from './shared/services/env.service';
import { SharedModule } from './shared/shared.module';
import { doubleCsrfProtection } from './utils/csrf';

@Module({
  imports: [
    RouterModule.register(routes),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 5,
          blockDuration: 3600000,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (envService: EnvService) => envService.dbConfig,
      inject: [EnvService],
    }),
    ScheduleModule.forRoot(),
    SharedModule,
    AuthModule,
    UserModule,
    ProfileModule,
    SchedulerModule,
    JobModule,
    SkillModule,
    MetricModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidateIncomingInput,
    },
    {
      provide: APP_PIPE,
      useClass: StripRequestBodyPipe,
    },
    // Global exception filter should be placed at first
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    // Other exception filters should be placed after global exception filter
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.IS_CSRF_ENABLED === 'true') {
      consumer
        .apply(doubleCsrfProtection)
        .exclude({ path: '/api-doc', method: RequestMethod.GET }, { path: '/v1/auth/csrf', method: RequestMethod.GET })
        .forRoutes('*');
    } else {
      console.log('⚠️ CSRF middleware skipped through feature flag');
    }
  }
}
