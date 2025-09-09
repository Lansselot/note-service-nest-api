import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OtpStorageService } from './otp-storage/otp-storage.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class OtpService {
  constructor(
    private otpStorageService: OtpStorageService,
    private mailerService: MailerService,
  ) {}

  private generateOTP(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async sendOTP(email: string): Promise<void> {
    const otp = this.generateOTP();

    await this.otpStorageService.setOtp(email, otp.toString(), 300);

    await this.mailerService.sendEmail(
      email,
      'Your OTP Code',
      `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    );
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.otpStorageService.getOtp(email);
    if (!storedOtp || storedOtp !== otp)
      throw new UnauthorizedException('Invalid or expired OTP');

    await this.otpStorageService.deleteOtp(email);

    return true;
  }
}
