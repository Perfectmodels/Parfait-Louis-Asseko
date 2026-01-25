import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import data
// Note: This relies on tsx or a bundler to resolve the import
import {
    models,
    navLinks,
    heroSlides,
    agencyServices,
    newsItems,
    testimonials,
    fashionDayEvents,
    contactInfo,
    siteConfig,
    socialLinks,
    agencyInfo,
    siteImages,
    agencyPartners
} from '../src/constants/data';

// Database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ DATABASE_URL is not defined in .env");
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function seed() {
    const client = await pool.connect();
    try {
        console.log("🚀 Starting seed process...");

        // 1. Run Schema
        console.log("📝 Applying schema...");
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log("✅ Schema applied.");

        // 2. Seed Data

        // Models
        console.log(`🌱 Seeding ${models.length} models...`);
        for (const m of models) {
            await client.query(`
                INSERT INTO models (id, name, username, password, gender, height, measurements, categories, image_url, experience, journey, quiz_scores, portfolio_images, distinctions)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                ON CONFLICT (id) DO NOTHING
            `, [
                m.id, m.name, m.username, m.password, m.gender, m.height,
                JSON.stringify(m.measurements), JSON.stringify(m.categories),
                m.imageUrl, m.experience, m.journey, JSON.stringify(m.quizScores),
                JSON.stringify(m.portfolioImages || []), JSON.stringify(m.distinctions || [])
            ]);
        }

        // Nav Links
        console.log(`🌱 Seeding ${navLinks.length} nav links...`);
        for (const l of navLinks) {
            await client.query(`
                INSERT INTO nav_links (id, path, label, in_footer, footer_label)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (id) DO NOTHING
            `, [l.id || `nav_${Date.now()}_${Math.random()}`, l.path, l.label, l.inFooter, l.footerLabel]);
        }

        // Hero Slides
        console.log(`🌱 Seeding ${heroSlides.length} hero slides...`);
        for (const s of heroSlides) {
            await client.query(`
                INSERT INTO hero_slides (id, image, title, subtitle, button_text, button_link, second_button_text, second_button_link, display_order)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (id) DO NOTHING
            `, [s.id, s.image, s.title, s.subtitle, s.buttonText, s.buttonLink, s.secondButtonText, s.secondButtonLink, s.order]);
        }

        // Services
        console.log(`🌱 Seeding ${agencyServices.length} services...`);
        for (const s of agencyServices) {
            await client.query(`
                INSERT INTO services (id, slug, icon, title, category, description, details, button_text, button_link)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (id) DO NOTHING
            `, [s.id, s.slug, s.icon, s.title, s.category, s.description, JSON.stringify(s.details), s.buttonText, s.buttonLink]);
        }

        // News Items
        console.log(`🌱 Seeding ${newsItems.length} news items...`);
        for (const n of newsItems) {
            await client.query(`
                INSERT INTO news_items (id, title, date, image_url, excerpt, link)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO NOTHING
            `, [n.id, n.title, n.date, n.imageUrl, n.excerpt, n.link]);
        }

        // Configs
        console.log("🌱 Seeding app config...");
        const configs = {
            'contactInfo': contactInfo,
            'siteConfig': siteConfig,
            'socialLinks': socialLinks,
            'agencyInfo': agencyInfo,
            'siteImages': siteImages
        };

        for (const [key, value] of Object.entries(configs)) {
            await client.query(`
                INSERT INTO app_config (key, value)
                VALUES ($1, $2)
                ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
            `, [key, JSON.stringify(value)]);
        }

        console.log("✅ Seeding complete!");
    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
