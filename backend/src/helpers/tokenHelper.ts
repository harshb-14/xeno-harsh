import jwt from 'jsonwebtoken';

// Create JWT token for tenant
export const createToken = (tenantId: string): string => {
  return jwt.sign(
    { tenantId }, 
    process.env.JWT_SECRET!, 
    { expiresIn: '7d' }
  );
};

// Verify JWT token and extract tenant ID
export const verifyToken = (token: string): { tenantId: string } => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { tenantId: string };
};