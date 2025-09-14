import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../helpers/responseHelper';

// Type for async route handler
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// Async wrapper to eliminate repetitive try-catch blocks
export const asyncHandler = (fn: AsyncRouteHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((error: any) => {
    console.error('Route error:', error);
    res.status(error.status || 500).json(errorResponse(error.message || 'Internal server error'));
  });
};

// Custom error class for better error handling
export class AppError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}