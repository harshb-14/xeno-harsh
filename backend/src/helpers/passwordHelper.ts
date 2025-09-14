import bcrypt from 'bcryptjs';

// Hash a plain text password
export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

// Verify password against hash
export const verifyPassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};