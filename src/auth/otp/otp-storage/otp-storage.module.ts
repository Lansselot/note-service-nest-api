import { Module } from '@nestjs/common';
import { OtpStorageService } from './otp-storage.service';

@Module({
  providers: [OtpStorageService],
  exports: [OtpStorageService],
})
export class OtpStorageModule {}
