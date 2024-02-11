import bcrypt from "bcrypt";
import { Request } from "express";

const jwt_compare = async (
  hashPassword: string,
  userPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(hashPassword, userPassword);
  return isMatch;
};


const cookieExtractor = function (req: Request) {
  let token = null;

  if (req && req.signedCookies) {
    token = req.signedCookies["auth.sid"];
  }
  return token;
};

export {jwt_compare, cookieExtractor}