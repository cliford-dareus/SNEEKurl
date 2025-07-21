import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateTokenPair = (userId: string, username: string): TokenPair => {
  // Short-lived access token (15 minutes)
  const accessToken = jwt.sign(
    { user_id: userId, user_name: username, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  // Long-lived refresh token (7 days) - use crypto for security
  const refreshToken = crypto.randomBytes(64).toString('hex');

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    // if (decoded.type !== 'access') {
    //   throw new Error('Invalid token type');
    // }
    return decoded;
  } catch (error) {
    throw error;
  }
};

export const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
