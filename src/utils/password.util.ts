import crypto from 'crypto';

export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const comparePassword = (plainPassword: string, hashedPassword: string): boolean => {
  const hashedPlain = hashPassword(plainPassword);
  return hashedPlain === hashedPassword;
};
