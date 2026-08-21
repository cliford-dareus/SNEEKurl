import bcrypt from 'bcrypt';
import Short from '../../models/short';
import User from '../../models/user';
import Click from '../../models/clicks';
import { create, visitUrl, getUrl } from '../../controllers/shortener';
import { createMockReq, createMockRes } from '../helpers/mockRes';
import { StatusCodes } from 'http-status-codes';

describe('Shortener controller (integration)', () => {
  let user: any;

  beforeEach(async () => {
    user = await User.create({
      username: 'linkowner',
      email: 'owner@example.com',
      password: 'password123',
      max_link: 50,
    });
  });

  describe('create', () => {
    it('creates a short link for authenticated user', async () => {
      const req = createMockReq({
        body: { longUrl: 'https://example.com/page' },
        userType: 'authenticated',
        user,
        linkLimits: { current: 0, limit: 50, remaining: 50 },
      });
      const res = createMockRes();
      await create(req as any, res as any);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.short.longUrl).toBe('https://example.com/page');
      expect(res.body.short.short).toBeDefined();

      const saved = await Short.findById(res.body.short._id);
      expect(saved!.user.toString()).toBe(user._id.toString());
    });

    it('creates with custom backhalf', async () => {
      const req = createMockReq({
        body: { longUrl: 'https://example.com/custom', backhalf: 'mycustom' },
        userType: 'authenticated',
        user,
      });
      const res = createMockRes();
      await create(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.short.short).toBe('mycustom');
    });

    it('rejects missing longUrl', async () => {
      const req = createMockReq({ body: {}, userType: 'authenticated', user });
      const res = createMockRes();
      await create(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('rejects invalid URL', async () => {
      const req = createMockReq({
        body: { longUrl: 'not-a-url' },
        userType: 'authenticated',
        user,
      });
      const res = createMockRes();
      await create(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('rejects duplicate longUrl for same user', async () => {
      await Short.create({
        longUrl: 'https://example.com/dup',
        short: 'duplink1',
        user: user._id,
      });
      const req = createMockReq({
        body: { longUrl: 'https://example.com/dup' },
        userType: 'authenticated',
        user,
      });
      const res = createMockRes();
      await create(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('hashes password when provided', async () => {
      const req = createMockReq({
        body: { longUrl: 'https://example.com/secret', password: 'linkpass' },
        userType: 'authenticated',
        user,
      });
      const res = createMockRes();
      await create(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.OK);
      const saved = await Short.findById(res.body.short._id);
      expect(saved!.password).not.toBe('linkpass');
      expect(await bcrypt.compare('linkpass', saved!.password!)).toBe(true);
    });

    it('creates guest link with expiry', async () => {
      const req = createMockReq({
        body: { longUrl: 'https://example.com/guest' },
        userType: 'guest',
        guest: { client_id: 'guest-fp-123', user_name: 'Guest' },
      });
      const res = createMockRes();
      await create(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.short.guest).toBe('guest-fp-123');
      expect(res.body.short.expired_in).toBeDefined();
      expect(res.body.limits.limit).toBe(5);
    });

    it('enforces guest link limit', async () => {
      const guestId = 'guest-limit-test';
      for (let i = 0; i < 5; i++) {
        await Short.create({
          longUrl: `https://example.com/g${i}`,
          short: `guest${i}xx`,
          guest: guestId,
          expired_in: new Date(Date.now() + 30 * 60 * 1000),
        });
      }
      const req = createMockReq({
        body: { longUrl: 'https://example.com/one-more' },
        userType: 'guest',
        guest: { client_id: guestId, user_name: 'Guest' },
      });
      const res = createMockRes();
      await create(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.PAYMENT_REQUIRED);
      expect(res.body.upgradeRequired).toBe(true);
    });
  });

  describe('visitUrl', () => {
    it('redirects to long URL and increments clicks', async () => {
      const short = await Short.create({
        longUrl: 'https://example.com/target',
        short: 'visitme1',
        user: user._id,
      });
      const req = createMockReq({
        params: { short: 'visitme1' },
        query: {},
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          referer: 'https://google.com/search',
        },
      });
      const res = createMockRes();
      await visitUrl(req as any, res as any);

      expect(res.statusCode).toBe(302);
      expect(res.redirectedTo).toBe('https://example.com/target');

      const updated = await Short.findById(short._id);
      expect(updated!.totalClicks).toBe(1);
      const clicks = await Click.find({ link: short._id });
      expect(clicks.length).toBe(1);
    });

    it('returns bad request for unknown short code', async () => {
      const req = createMockReq({ params: { short: 'missing1' }, query: {}, headers: {} });
      const res = createMockRes();
      await visitUrl(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('requires password when link is protected', async () => {
      const hash = await bcrypt.hash('secret', 10);
      await Short.create({
        longUrl: 'https://example.com/protected',
        short: 'protlink',
        user: user._id,
        password: hash,
      });
      const req = createMockReq({
        params: { short: 'protlink' },
        query: {},
        headers: { 'user-agent': 'test' },
      });
      const res = createMockRes();
      await visitUrl(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    });

    it('redirects when correct password is provided', async () => {
      const hash = await bcrypt.hash('secret', 10);
      await Short.create({
        longUrl: 'https://example.com/protected',
        short: 'protlink2',
        user: user._id,
        password: hash,
      });
      const req = createMockReq({
        params: { short: 'protlink2' },
        query: { password: 'secret' },
        headers: { 'user-agent': 'test' },
      });
      const res = createMockRes();
      await visitUrl(req as any, res as any);
      expect(res.statusCode).toBe(302);
      expect(res.redirectedTo).toBe('https://example.com/protected');
    });

    it('rejects incorrect password', async () => {
      const hash = await bcrypt.hash('secret', 10);
      await Short.create({
        longUrl: 'https://example.com/protected',
        short: 'protlink3',
        user: user._id,
        password: hash,
      });
      const req = createMockReq({
        params: { short: 'protlink3' },
        query: { password: 'wrong' },
        headers: { 'user-agent': 'test' },
      });
      const res = createMockRes();
      await visitUrl(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(res.body.message).toMatch(/incorrect password/i);
    });
  });

  describe('getUrl', () => {
    it('returns link data for existing short code', async () => {
      await Short.create({
        longUrl: 'https://example.com/get',
        short: 'getme123',
        user: user._id,
      });
      const req = createMockReq({ params: { short: 'getme123' } });
      const res = createMockRes();
      await getUrl(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.short.longUrl).toBe('https://example.com/get');
    });

    it('returns bad request when link does not exist', async () => {
      const req = createMockReq({ params: { short: 'nope1234' } });
      const res = createMockRes();
      await getUrl(req as any, res as any);
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
