import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Extended request interface for webhook handling
interface WebhookRequest extends Request {
  body: any;
}

// Shopify webhook verification middleware
export const verifyShopifyWebhook = (req: WebhookRequest, res: Response, next: NextFunction) => {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const body = req.body; // Raw buffer from express.raw()
  
  if (!process.env.SHOPIFY_WEBHOOK_SECRET) {
    console.warn('SHOPIFY_WEBHOOK_SECRET not set, skipping verification');
    req.body = parseBody(body, res);
    if (req.body !== null) return next();
    return;
  }
  
  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(body)
    .digest('base64');

  if (hash !== hmac) {
    console.error('Webhook verification failed:', { 
      received: hmac, 
      calculated: hash,
      shopDomain: req.get('X-Shopify-Shop-Domain')
    });
    return res.status(401).json({ error: 'Webhook verification failed' });
  }

  console.log('Webhook verification successful for shop:', req.get('X-Shopify-Shop-Domain'));
  req.body = parseBody(body, res);
  if (req.body !== null) next();
};

const parseBody = (body: Buffer, res: Response) => {
  try {
    return JSON.parse(body.toString());
  } catch (e) {
    res.status(400).json({ error: 'Invalid JSON' });
    return null;
  }
};