import { findTenantByEmail, createTenant } from '../database/tenantQueries';
import { hashPassword, verifyPassword } from '../helpers/passwordHelper';
import { createToken } from '../helpers/tokenHelper';
import { formatTenantResponse } from '../helpers/responseHelper';
import { AppError } from '../utils/asyncHandler';

interface TenantData {
  name: string;
  email: string;
  password: string;
  shopifyUrl: string;
  accessToken: string;
}

// Register new tenant
export const registerTenant = async (tenantData: TenantData) => {
  const existingTenant = await findTenantByEmail(tenantData.email);
  if (existingTenant) {
    throw new AppError('Tenant already exists', 400);
  }

  const hashedPassword = await hashPassword(tenantData.password);
  const tenant = await createTenant({
    ...tenantData,
    password: hashedPassword
  });

  const token = createToken(tenant.id);
  return {
    token,
    tenant: formatTenantResponse(tenant)
  };
};

// Login existing tenant
export const loginTenant = async (email: string, password: string) => {
  const tenant = await findTenantByEmail(email);
  if (!tenant) {
    throw new AppError('Invalid credentials', 401);
  }

  const validPassword = await verifyPassword(password, tenant.password);
  if (!validPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = createToken(tenant.id);
  return {
    token,
    tenant: formatTenantResponse(tenant)
  };
};