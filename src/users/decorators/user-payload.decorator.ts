// src/auth/decorators/user-payload.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUserPayload } from 'src/common/dto/jwt-payload.dto';
import { Request } from 'express';

export const UserPayload = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUserPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as JwtUserPayload;
  },
);
