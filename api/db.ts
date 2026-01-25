import { Pool } from 'pg';

// Defaults to the environment variable if not provided
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Neon requires SSL
  },
});

export default pool;
