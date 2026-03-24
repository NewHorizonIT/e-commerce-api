import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../error/error';
import { config } from '@/config';

const accessTokenExpiresIn = config.jwt.accessToken.expiresIn as jwt.SignOptions['expiresIn'];
const refreshTokenExpiresIn = config.jwt.refreshToken.expiresIn as jwt.SignOptions['expiresIn'];

function generateJwtToken(payload: object, secret: string, options?: jwt.SignOptions): string {
  const token = jwt.sign(payload, secret, options);
  return token;
}

function verifyJwtToken<T extends object>(token: string, secret: string): T {
  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string') {
      throw new UnauthorizedError('Invalid token payload');
    }

    return decoded as T;
  } catch (error) {
    throw new UnauthorizedError('Invalid token', undefined, error);
  }
}

function generatePairJwtTokens(payload: object): { accessToken: string; refreshToken: string } {
  const secretAccessToken = config.jwt.accessToken.secret;
  const secretRefreshToken = config.jwt.refreshToken.secret;
  const accessToken = generateJwtToken(payload, secretAccessToken, {
    expiresIn: accessTokenExpiresIn,
  });
  const refreshToken = generateJwtToken(payload, secretRefreshToken, {
    expiresIn: refreshTokenExpiresIn,
  });
  return { accessToken, refreshToken };
}

export { generateJwtToken, verifyJwtToken, generatePairJwtTokens };
