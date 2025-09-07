import { neon } from '@neondatabase/serverless';
import { NextApiRequest, NextApiResponse } from 'next';

// This is a Vercel serverless function
// It will be accessible at the path /api/data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure we're only handling GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Create a new Neon SQL instance. The DATABASE_URL is read from environment variables.
    const sql = neon(process.env.DATABASE_URL!);

    // --- Fetch data from all necessary tables ---
    // We run all queries in parallel for maximum efficiency
    const [
      models,
      articles,
      testimonials,
      news,
      events,
      services,
      beginnerStudents
    ] = await Promise.all([
      sql`SELECT * FROM models WHERE is_public = true;`,
      sql`SELECT * FROM articles ORDER BY date DESC;`,
      sql`SELECT * FROM testimonials;`,
      sql`SELECT * FROM news_items ORDER BY date DESC;`,
      sql`SELECT * FROM fashion_day_events ORDER BY date DESC;`,
      sql`SELECT * FROM services;`,
      sql`SELECT id, name, matricule, quiz_scores FROM beginner_students;` // No password!
    ]);

    // --- Fetch single-row settings ---
    // We assume the settings table has a single row with id = 1
    const settingsResult = await sql`SELECT * FROM site_settings WHERE id = 1;`;
    const settings = settingsResult[0] || {};

    // --- Combine all data into a single object ---
    const allData = {
      models,
      articles,
      testimonials,
      news,
      fashionDayEvents: events,
      services,
      beginnerStudents,
      settings
    };

    // Send the successful response
    res.status(200).json(allData);

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Database query failed:', error);
    
    // Send an error response
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
