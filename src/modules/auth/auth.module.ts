import { Module } from '@nestjs/common';
import { SkillModule } from '../skill/skill.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, SkillModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
