import { Module } from '@nestjs/common';
import { JwtTokensService } from './jwt-tokens.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtTokensService],
  exports: [JwtTokensService],
})
export class JwtTokensModule {}
