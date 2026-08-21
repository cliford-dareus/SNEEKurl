import bcrypt from 'bcrypt';
import { jwt_compare } from '../../lib/utils/jwt';

describe('jwt_compare (bcrypt password check)', () => {
  it('returns true for matching password', async () => {
    const plain = 'SecretPass123';
    const hash = await bcrypt.hash(plain, 10);
    expect(await jwt_compare(plain, hash)).toBe(true);
  });

  it('returns false for wrong password', async () => {
    const hash = await bcrypt.hash('correct-password', 10);
    expect(await jwt_compare('wrong-password', hash)).toBe(false);
  });
});
