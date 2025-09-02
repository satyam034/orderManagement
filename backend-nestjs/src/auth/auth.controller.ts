import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body() body: { mobile: string }) {
    const mobile = body.mobile;
    if (!mobile) {
      return { ok: false, message: 'mobile required' };
    }
    return this.authService.sendOtp(mobile);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { mobile: string; otp: string }) {
    const { mobile, otp } = body;
    if (!mobile || !otp) {
      return { ok: false, message: 'mobile and otp required' };
    }
    return this.authService.verifyOtp(mobile, otp);
  }
}
