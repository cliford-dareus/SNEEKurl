import User from '../../models/user';
import { register, login, logout } from '../../controllers/auth';
import { createMockReq, createMockRes } from '../helpers/mockRes';
import { generateTokenPair, hashRefreshToken } from '../../lib/utils/tokens';
import { StatusCodes } from 'http-status-codes';

describe('Auth controller (integration)', () => {
  describe('register', () => {
    it('creates a user with hashed password', async () => {
      const req = createMockReq({
        body: { username: 'alice', email: 'alice@example.com', password: 'password123' },
        session: { client_id: 'guest-client-1' },
      });
      const res = createMockRes();
      await register(req as any, res as any);

      expect(res.statusCode).toBe(StatusCodes.CREATED);
      expect(res.body.message).toBe('User created');
      expect(res.body.user.username).toBe('alice');

      const user = await User.findOne({ email: 'alice@example.com' });
      expect(user).toBeTruthy();
      expect(user!.password).not.toBe('password123');
      expect(user!.password.length).toBeGreaterThan(20);
    });

    it('rejects missing fields', async () => {
      const req = createMockReq({ body: { username: 'bob' }, session: {} });
      const res = createMockRes();
      await register(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('rejects duplicate email', async () => {
      await User.create({ username: 'existing', email: 'dup@example.com', password: 'password123' });
      const req = createMockReq({
        body: { username: 'newuser', email: 'dup@example.com', password: 'password123' },
        session: {},
      });
      const res = createMockRes();
      await register(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await User.create({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'correct-password',
      });
    });

    it('logs in with valid credentials and sets tokens', async () => {
      const req = createMockReq({
        body: { username: 'loginuser', password: 'correct-password' },
        session: {},
        signedCookies: {},
      });
      const res = createMockRes();
      await login(req as any, res as any);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.user.username).toBe('loginuser');
      expect(res.body.accessToken).toBeDefined();

      const user = await User.findOne({ username: 'loginuser' });
      expect(user!.refreshToken).toBeDefined();
    });

    it('rejects wrong password', async () => {
      const req = createMockReq({
        body: { username: 'loginuser', password: 'wrong' },
        session: {},
        signedCookies: {},
      });
      const res = createMockRes();
      await login(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('rejects unknown user', async () => {
      const req = createMockReq({
        body: { username: 'nobody', password: 'anything' },
        session: {},
        signedCookies: {},
      });
      const res = createMockRes();
      await login(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('rejects missing credentials', async () => {
      const req = createMockReq({ body: {}, session: {}, signedCookies: {} });
      const res = createMockRes();
      await login(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('logout', () => {
    it('clears refresh token and returns success', async () => {
      const user = await User.create({
        username: 'logoutuser',
        email: 'logout@example.com',
        password: 'password123',
        refreshToken: hashRefreshToken('some-refresh'),
        refreshTokenExpiry: new Date(Date.now() + 86400000),
      });
      const { accessToken } = generateTokenPair(user._id.toString(), user.username);
      const req = createMockReq({
        user,
        token: accessToken,
        session: { destroy: (cb: (err?: any) => void) => cb() },
      });
      const res = createMockRes();
      await logout(req as any, res as any);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.message).toMatch(/logged out/i);
      const updated = await User.findById(user._id);
      expect(updated!.refreshToken).toBeUndefined();
    });
  });
});
