import express from 'express';
import { registerTenant, loginTenant } from '../services/authService';
import { successResponse } from '../helpers/responseHelper';
import { asyncHandler, AppError } from '../utils/asyncHandler';

const router = express.Router();

// Register new tenant
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, shopifyUrl, accessToken } = req.body;
  
  if (!name || !email || !password || !shopifyUrl || !accessToken) {
    throw new AppError('All fields are required', 400);
  }
  
  const result = await registerTenant({
    name, email, password, shopifyUrl, accessToken
  });

  res.status(201).json(successResponse('Registration successful', result));
}));

// Login existing tenant
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }
  
  const result = await loginTenant(email, password);
  
  res.json(successResponse('Login successful', result));
}));

export default router;
