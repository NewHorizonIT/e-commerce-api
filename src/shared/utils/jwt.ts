import jwt from 'jsonwebtoken';

function generateJwtToken(payload: object, secret: string, options?: jwt.SignOptions): string {
  const token = jwt.sign(payload, secret, options);
  return token;
}

function verifyJwtToken(token: string, secret: string): object | string {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export { generateJwtToken, verifyJwtToken };
