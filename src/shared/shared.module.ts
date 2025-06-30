import { Global, Module, Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/shared/services/token.service';
import { IsUniqueConstraint } from 'src/utils/validators/is-unique.validator';
import { MatchPasswordConstraint } from 'src/utils/validators/match-password.validator';
import { EncryptionService } from './services/encryption.service';
import { EnvService } from './services/env.service';
import { GeneratorService } from './services/generator.service';

const providers: Provider[] = [
  JwtService,
  TokenService,
  EnvService,
  GeneratorService,
  EncryptionService,
  IsUniqueConstraint,
  MatchPasswordConstraint,
];

@Global()
@Module({
  imports: [],
  providers,
  exports: [...providers],
})
export class SharedModule {}
