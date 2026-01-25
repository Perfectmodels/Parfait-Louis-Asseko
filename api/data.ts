import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from './db';

const ALLOWED_TABLES = [
  'models', 'articles', 'fashion_day_events', 'news_items',
  'casting_applications', 'fashion_day_applications', 'nav_links',
  'hero_slides', 'services', 'app_config', 'gallery'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { collection, id } = req.query;
  const table = Array.isArray(collection) ? collection[0] : collection;

  if (!table || !ALLOWED_TABLES.includes(table)) {
    return res.status(400).json({ error: 'Invalid or missing collection' });
  }

  // Basic security check for write operations
  if (req.method !== 'GET') {
      const authHeader = req.headers['x-admin-secret'];
      const secret = process.env.ADMIN_SECRET;
      if (!secret || authHeader !== secret) {
          return res.status(401).json({ error: 'Unauthorized' });
      }
  }

  const client = await pool.connect();

  try {
    switch (req.method) {
      case 'GET':
        if (id) {
          // Validate ID prevents basic injection, though parameterized queries do this too
          const result = await client.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
          if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
          return res.status(200).json(result.rows[0]);
        } else {
          if (table === 'app_config') {
             const result = await client.query(`SELECT * FROM ${table}`);
             const config: Record<string, any> = {};
             result.rows.forEach(row => {
               config[row.key] = row.value;
             });
             return res.status(200).json(config);
          }
          const result = await client.query(`SELECT * FROM ${table}`);
          return res.status(200).json(result.rows);
        }

      case 'POST':
        const body = req.body;
        if (!body.id) body.id = `doc_${Date.now()}`;

        const keys = Object.keys(body);

        // Validate column names to prevent SQL Injection via keys
        const isValidKey = (key: string) => /^[a-zA-Z0-9_]+$/.test(key);
        if (!keys.every(isValidKey)) {
            return res.status(400).json({ error: 'Invalid column names' });
        }

        const values = Object.values(body);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        // Table is whitelisted, Keys are regex-validated. Safe to construct query.
        const insertQuery = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const insertResult = await client.query(insertQuery, values);
        return res.status(201).json(insertResult.rows[0]);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error', details: String(error) });
  } finally {
    client.release();
  }
}
