import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  if (!apiSecret || !cloudName || !apiKey) {
    return res.status(500).json({ error: 'Cloudinary not configured on server.' });
  }

  const { folder, public_id } = req.body as { folder?: string; public_id?: string };

  const timestamp = Math.round(Date.now() / 1000);

  // Build params to sign (alphabetical order, no empty values)
  const params: Record<string, string | number> = { timestamp };
  if (folder) params.folder = folder;
  if (public_id) params.public_id = public_id;

  const sortedParams = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');

  const signature = crypto
    .createHash('sha256')
    .update(sortedParams + apiSecret)
    .digest('hex');

  return res.status(200).json({
    signature,
    timestamp,
    apiKey,
    cloudName,
  });
}
