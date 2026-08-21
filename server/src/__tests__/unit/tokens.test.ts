import {
  generateTokenPair,
  verifyAccessToken,
  hashRefreshToken,
} from '../../lib/utils/tokens';
import jwt from 'jsonwebtoken';

describe('token utils', () => {
  const userId = '507f1f77bcf86cd799439011';
  const username = 'testuser';

  it('generateTokenPair returns access and refresh tokens', () => {
    const pair = generateTokenPair(userId, username);
    expect(pair.accessToken).toBeDefined();
    expect(pair.refreshToken).toBeDefined();
    expect(pair.refreshToken.length).toBeGreaterThan(32);
  });

  it('verifyAccessToken decodes a valid access token', () => {
    const { accessToken } = generateTokenPair(userId, username);
    const decoded = verifyAccessToken(accessToken);
    expect(decoded.user_id).toBe(userId);
    expect(decoded.user_name).toBe(username);
  });

  it('verifyAccessToken throws on invalid token', () => {
    expect(() => verifyAccessToken('not.a.valid.token')).toThrow();
  });

  it('verifyAccessToken throws on wrong secret', () => {
    const bad = jwt.sign({ user_id: userId }, 'wrong-secret');
    expect(() => verifyAccessToken(bad)).toThrow();
  });

  it('hashRefreshToken is deterministic', () => {
    const token = 'abc123refresh';
    expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
    expect(hashRefreshToken(token)).toMatch(/^[a-f0-9]{64}$/);
  });
});
