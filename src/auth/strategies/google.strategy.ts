import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    if (!profile.emails || profile.emails.length === 0)
      throw new UnauthorizedException('No email found from Google');
    console.log(profile);

    const existingUser = await this.userService.getUserByEmail(
      profile.emails[0].value,
    );
    if (existingUser) return done(null, { userId: existingUser?.id });

    const newUser = await this.userService.createGoogleUser({
      id: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
    });
    return done(null, { userId: newUser?.id });
  }
}
