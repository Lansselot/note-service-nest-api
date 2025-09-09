import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpStorageModule } from './otp-storage/otp-storage.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [OtpStorageModule, MailerModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
