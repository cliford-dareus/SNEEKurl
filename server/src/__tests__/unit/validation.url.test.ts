import { createShortSchema, editShortSchema } from '../../lib/validation/url';

describe('createShortSchema', () => {
  it('accepts a valid https URL', () => {
    const result = createShortSchema.safeParse({ longUrl: 'https://example.com/path' });
    expect(result.success).toBe(true);
  });

  it('accepts valid backhalf and password', () => {
    const result = createShortSchema.safeParse({
      longUrl: 'https://example.com',
      backhalf: 'my-link',
      password: 'secret',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing longUrl', () => {
    expect(createShortSchema.safeParse({}).success).toBe(false);
  });

  it('rejects non-http(s) protocol', () => {
    expect(createShortSchema.safeParse({ longUrl: 'ftp://files.example.com' }).success).toBe(false);
  });

  it('rejects invalid URL string', () => {
    expect(createShortSchema.safeParse({ longUrl: 'not-a-url' }).success).toBe(false);
  });

  it('rejects short backhalf', () => {
    expect(
      createShortSchema.safeParse({ longUrl: 'https://example.com', backhalf: 'ab' }).success
    ).toBe(false);
  });

  it('rejects backhalf with special characters', () => {
    expect(
      createShortSchema.safeParse({ longUrl: 'https://example.com', backhalf: 'bad link!' }).success
    ).toBe(false);
  });

  it('rejects short password', () => {
    expect(
      createShortSchema.safeParse({ longUrl: 'https://example.com', password: 'abc' }).success
    ).toBe(false);
  });

  it('treats empty backhalf as undefined', () => {
    const result = createShortSchema.safeParse({ longUrl: 'https://example.com', backhalf: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.backhalf).toBeUndefined();
  });
});

describe('editShortSchema', () => {
  it('requires id', () => {
    expect(editShortSchema.safeParse({ longUrl: 'https://example.com' }).success).toBe(false);
  });

  it('accepts id only', () => {
    expect(editShortSchema.safeParse({ id: '507f1f77bcf86cd799439011' }).success).toBe(true);
  });

  it('accepts null password', () => {
    expect(
      editShortSchema.safeParse({ id: '507f1f77bcf86cd799439011', password: null }).success
    ).toBe(true);
  });
});
