import fs from "fs";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

// 🔹 Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_jjJEXU7yvJv49aiPCJqEZgiyfJEJzrg",
  authDomain: "pmmdb-89a3f.firebaseapp.com",
  databaseURL: "https://pmmdb-89a3f-default-rtdb.firebaseio.com",
  projectId: "pmmdb-89a3f",
  storageBucket: "pmmdb-89a3f.appspot.com",
  messagingSenderId: "269517012553",
  appId: "1:269517012553:web:f596b9536963ae20148998",
  measurementId: "G-8LFX4M3PGS"
};

// 🔹 Initialiser Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔹 Pages statiques
const staticPages = [
  { loc: "/", changefreq: "daily", priority: 1.0 },
  { loc: "/agence", changefreq: "monthly", priority: 0.8 },
  { loc: "/services", changefreq: "monthly", priority: 0.8 },
  { loc: "/contact", changefreq: "yearly", priority: 0.6 },
  { loc: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
  { loc: "/terms-of-use", changefreq: "yearly", priority: 0.3 }
];

// 🔹 Fonction pour générer une URL XML
function generateUrl(loc, lastmod, changefreq, priority) {
  return `
  <url>
    <loc>https://www.perfectmodels.ga${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// 🔹 Fonction principale
async function generateSitemap() {
  let urls = "";
  const today = new Date().toISOString().split("T")[0];

  // Ajouter pages statiques
  staticPages.forEach(page => {
    urls += generateUrl(page.loc, today, page.changefreq, page.priority);
  });

  // Ajouter mannequins dynamiques
  const mannequinsSnapshot = await db.ref("mannequins").once("value");
  const mannequins = mannequinsSnapshot.val() || {};
  Object.values(mannequins).forEach(m => {
    urls += generateUrl(`/mannequins/${m.slug || m.id}`, m.updatedAt || today, "weekly", 0.9);
  });

  // Ajouter articles dynamiques
  const articlesSnapshot = await db.ref("articles").once("value");
  const articles = articlesSnapshot.val() || {};
  Object.values(articles).forEach(a => {
    urls += generateUrl(`/magazine/${a.slug || a.id}`, a.updatedAt || today, "weekly", 0.8);
  });

  // Ajouter fashion day / événements dynamiques
  const eventsSnapshot = await db.ref("fashion-day").once("value");
  const events = eventsSnapshot.val() || {};
  Object.values(events).forEach(e => {
    urls += generateUrl(`/fashion-day/${e.slug || e.id}`, e.updatedAt || today, "weekly", 0.8);
  });

  // Ajouter casting dynamiques
  const castingSnapshot = await db.ref("casting").once("value");
  const castings = castingSnapshot.val() || {};
  Object.values(castings).forEach(c => {
    urls += generateUrl(`/casting/${c.slug || c.id}`, c.updatedAt || today, "monthly", 0.7);
  });

  // Construire le sitemap complet
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  // Écrire dans public/
  fs.writeFileSync("public/sitemap.xml", sitemap);
  console.log("✅ Sitemap complet généré dans public/sitemap.xml !");
}

// Lancer le script
generateSitemap().catch(console.error);
