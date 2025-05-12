import { Request } from 'express';
import { isMissingOrEmpty } from './typecheck';
import { UnauthorizedException } from '@nestjs/common';

export function extractTokenFromHeader(request: Request): string {
  const authHeader = request.headers.authorization;

  if (isMissingOrEmpty(authHeader)) {
    throw new UnauthorizedException('Authorization header is missing');
  }

  const [tokenType, tokenValue] = authHeader.split(' ');

  if (!tokenType.toLowerCase().startsWith('bearer')) {
    throw new UnauthorizedException('Bearer type token is required');
  }
  return tokenValue;
}
