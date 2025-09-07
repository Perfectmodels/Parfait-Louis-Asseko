const { neon } = require("@neondatabase/serverless");

async function runTest() {
    console.log("Starting direct connection test...");
    if (!process.env.DATABASE_URL) {
        console.error("[!] ERROR: DATABASE_URL is not set in the environment!");
        process.exit(1);
    }

    console.log("DATABASE_URL found. Attempting to connect to Neon...");

    try {
        const sql = neon(process.env.DATABASE_URL);
        const result = await sql`SELECT version()`;
        const { version } = result[0];
        console.log("\n✅ --- SUCCESS --- ✅");
        console.log("Successfully connected to Neon and ran a query.");
        console.log("PostgreSQL Version:", version);
        console.log("---------------------");
    } catch (error) {
        console.error("\n❌ --- CONNECTION FAILED --- ❌");
        console.error("The script failed to connect or query the database.");
        console.error("Error details:", error.message);
        console.log("-----------------------------");
        process.exit(1);
    }
}

runTest();
