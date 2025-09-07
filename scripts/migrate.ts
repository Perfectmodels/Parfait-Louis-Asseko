import { neon } from '@neondatabase/serverless';
import { promises as fs } from 'fs';
import path from 'path';

console.log("Migration script started...");

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
    try {
        const startTime = Date.now();
        console.log("Connecting to the database...");
        await sql`SELECT 1`; // Test connection
        console.log("Database connection successful.");

        const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
        const dataPath = path.join(process.cwd(), 'src', 'db', 'data.sql');

        console.log(`Reading schema from: ${schemaPath}`);
        const schema = await fs.readFile(schemaPath, 'utf-8');
        console.log("Executing schema.sql...");
        await sql.unsafe(schema);
        console.log("Schema applied successfully.");

        console.log(`Reading data from: ${dataPath}`);
        const data = await fs.readFile(dataPath, 'utf-8');
        console.log("Executing data.sql...");
        await sql.unsafe(data);
        console.log("Data inserted successfully.");

        const endTime = Date.now();
        console.log(`\n✅ Migration completed successfully in ${(endTime - startTime) / 1000} seconds.`);

    } catch (error) {
        console.error("\n❌ --- MIGRATION FAILED ---");
        console.error("An error occurred during the migration process:");
        console.error(error);
        console.error("---------------------------");
        process.exit(1);
    }
}

main();
