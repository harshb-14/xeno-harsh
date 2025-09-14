import { prisma } from '../utils/prisma';

// Count products for tenant
export const countProducts = async (tenantId: string) => {
  return prisma.product.count({ where: { tenantId } });
};

// Create or update product from Shopify data
export const upsertProduct = async (tenantId: string, productData: any) => {
  return prisma.product.upsert({
    where: {
      tenantId_shopifyId: {
        tenantId,
        shopifyId: productData.id.toString()
      }
    },
    update: {
      title: productData.title,
      handle: productData.handle,
      productType: productData.product_type,
      vendor: productData.vendor,
      status: productData.status,
      shopifyCreatedAt: productData.created_at ? new Date(productData.created_at) : null
    },
    create: {
      tenantId,
      shopifyId: productData.id.toString(),
      title: productData.title,
      handle: productData.handle,
      productType: productData.product_type,
      vendor: productData.vendor,
      status: productData.status,
      shopifyCreatedAt: productData.created_at ? new Date(productData.created_at) : null
    }
  });
};